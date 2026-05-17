import { useEffect, useMemo, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Download,
  Eye,
  FileCode2,
  FilePlus2,
  FolderOpen,
  Import,
  LayoutDashboard,
  Moon,
  PackageCheck,
  Search,
  ShieldAlert,
  Sun,
  Upload,
  X,
} from 'lucide-react';
import Canvas from './components/Canvas';
import CartSidebar from './components/CartSidebar';
import ConfigPanel from './components/ConfigPanel';
import LibrarySidebar from './components/LibrarySidebar';
import { loadCatalog, loadKnowledgeArticles } from './lib/catalog';
import {
  createTextFile,
  createPackage,
  downloadBlob,
  getSkillFile,
  normalizePath,
  packageToSkillContent,
  removePackageFile,
  renamePackageFile,
  slugifySkillName,
  upsertPackageFile,
} from './lib/packageUtils';
import { createPackageFromTemplate, templates, TemplateId } from './lib/templates';
import {
  deletePackage,
  exportWorkspaceBackup,
  importWorkspaceBackup,
  listWorkspacePackages,
  saveDraft,
} from './lib/storage';
import { exportPackageZip, importPackageZip, ImportPackageError } from './lib/zip';
import { validatePackage } from './lib/validation';
import { CatalogSkill, KnowledgeArticle, LocalSkillStatus, SkillPackage, ValidationIssue } from './types';

type Screen = 'catalog' | 'builder' | 'import' | 'workspace' | 'review' | 'learn' | 'composer';
type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'ai-skill-creator-theme';

const navItems: Array<{ id: Screen; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'catalog', label: 'Catalog', icon: LayoutDashboard },
  { id: 'builder', label: 'Builder', icon: FileCode2 },
  { id: 'import', label: 'Import', icon: Import },
  { id: 'workspace', label: 'Workspace', icon: FolderOpen },
  { id: 'review', label: 'Review', icon: PackageCheck },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'composer', label: 'Composer', icon: Archive },
];

const statusLabels: Record<LocalSkillStatus, string> = {
  draft: 'Draft',
  validated: 'Validated',
  submitted_local: 'Submitted',
  approved_local: 'Approved',
  rejected_local: 'Rejected',
  blocked_local: 'Blocked',
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderMarkdown = (value: string) =>
  escapeHtml(value)
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />');

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    return 'light';
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const updatePackageMetadataFromSkill = (pkg: SkillPackage): SkillPackage => {
  const skill = getSkillFile(pkg);
  if (!skill?.textContent) return pkg;
  const name = skill.textContent.match(/\n?name:\s*([^\n\r]+)/)?.[1]?.trim();
  const description = skill.textContent.match(/\n?description:\s*([^\n\r]+)/)?.[1]?.trim();
  return {
    ...pkg,
    rootFolder: slugifySkillName(name || pkg.metadata.name),
    metadata: {
      ...pkg.metadata,
      name: slugifySkillName(name || pkg.metadata.name),
      description: description || pkg.metadata.description,
    },
  };
};

const catalogSkillContent = (skill: CatalogSkill) => {
  if (skill.content.trim().startsWith('---')) return skill.content;

  return `---
name: ${slugifySkillName(skill.name || skill.title)}
description: ${skill.description}
---

# Workflow

${skill.content || skill.summary || skill.description}
`;
};

const createPackageFromCatalogSkill = (skill: CatalogSkill): SkillPackage => {
  const name = slugifySkillName(skill.name || skill.title);
  const content = catalogSkillContent(skill);
  const metadata = {
    name,
    description: skill.description,
    category: skill.category,
    tags: skill.tags || [],
    compatibility: skill.compatibility || ['codex'],
    license: skill.license || 'MIT',
    version: skill.version || '0.1.0',
  };
  const pkg = createPackage(
    metadata,
    [
      createTextFile('SKILL.md', content),
      createTextFile(
        'README.md',
        `# ${skill.title || skill.name}

${skill.description}

- Category: ${skill.category}
- Trust level: ${skill.trustLevel || 'seed'}
- Risk level: ${skill.riskLevel || 'unknown'}
- Compatibility: ${(skill.compatibility || ['codex']).join(', ')}
`,
      ),
      createTextFile(
        'metadata.json',
        JSON.stringify(
          {
            ...metadata,
            title: skill.title,
            author: skill.author,
            updatedAt: skill.updatedAt,
            trustLevel: skill.trustLevel || 'seed',
            riskLevel: skill.riskLevel || 'unknown',
          },
          null,
          2,
        ),
      ),
    ],
    'catalog',
  );
  const validationReport = validatePackage(pkg);

  return {
    ...pkg,
    validationReport,
    localStatus: validationReport.status === 'passed' || validationReport.status === 'passed_with_warnings' ? 'validated' : 'draft',
  };
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('catalog');
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [catalog, setCatalog] = useState<CatalogSkill[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [workspace, setWorkspace] = useState<SkillPackage[]>([]);
  const [activePackage, setActivePackage] = useState<SkillPackage>(() => createPackageFromTemplate('minimal'));
  const [selectedPath, setSelectedPath] = useState('SKILL.md');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Theme persistence is optional; the UI should still update if storage is unavailable.
    }
  }, [theme]);

  const selectedFile = activePackage.files.find((file) => file.path === selectedPath) || activePackage.files[0];

  const refreshWorkspace = async () => {
    const packages = await listWorkspacePackages();
    setWorkspace(packages.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  };

  useEffect(() => {
    loadCatalog().then(setCatalog).catch(() => setCatalog([]));
    loadKnowledgeArticles().then(setArticles).catch(() => setArticles([]));
    refreshWorkspace();
  }, []);

  useEffect(() => {
    setSaveState('saving');
    const handle = window.setTimeout(async () => {
      try {
        await saveDraft(activePackage);
        await refreshWorkspace();
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }, 700);

    return () => window.clearTimeout(handle);
  }, [activePackage]);

  const setPackage = (pkg: SkillPackage) => {
    setActivePackage(pkg);
    setSelectedPath(pkg.files.some((file) => file.path === selectedPath) ? selectedPath : 'SKILL.md');
  };

  const createFromTemplate = (templateId: TemplateId) => {
    const pkg = createPackageFromTemplate(templateId);
    setPackage(pkg);
    setScreen('builder');
    setMessage(`Created ${pkg.metadata.name} from template.`);
  };

  const runValidation = () => {
    const normalized = updatePackageMetadataFromSkill(activePackage);
    const report = validatePackage(normalized);
    setPackage({
      ...normalized,
      validationReport: report,
      localStatus: report.status === 'passed' || report.status === 'passed_with_warnings' ? 'validated' : 'draft',
      updatedAt: new Date().toISOString(),
    });
  };

  const exportActivePackage = async () => {
    const report = validatePackage(activePackage);
    const pkg = { ...updatePackageMetadataFromSkill(activePackage), validationReport: report };
    setPackage(pkg);
    const blob = await exportPackageZip(pkg);
    const suffix = pkg.localStatus === 'draft' ? 'draft' : pkg.metadata.version || '0.1.0';
    downloadBlob(blob, `${pkg.rootFolder}-${suffix}.zip`);
  };

  const openPackage = (pkg: SkillPackage) => {
    setPackage(pkg);
    setScreen('builder');
  };

  const updateSelectedFile = (textContent: string) => {
    if (!selectedFile) return;
    const updated = upsertPackageFile(activePackage, {
      ...selectedFile,
      textContent,
      size: new Blob([textContent]).size,
    });
    setPackage(updated);
  };

  const addFile = () => {
    const path = window.prompt('File path', 'references/notes.md');
    if (!path) return;
    const normalized = normalizePath(path);
    if (activePackage.files.some((file) => file.path === normalized)) {
      setMessage('A file with this path already exists.');
      return;
    }
    setPackage(upsertPackageFile(activePackage, createTextFile(normalized, '')));
    setSelectedPath(normalized);
  };

  const renameFile = () => {
    if (!selectedFile || selectedFile.path === 'SKILL.md') return;
    const path = window.prompt('New file path', selectedFile.path);
    if (!path) return;
    const normalized = normalizePath(path);
    setPackage(renamePackageFile(activePackage, selectedFile.path, normalized));
    setSelectedPath(normalized);
  };

  const deleteFile = () => {
    if (!selectedFile || selectedFile.path === 'SKILL.md') return;
    setPackage(removePackageFile(activePackage, selectedFile.path));
    setSelectedPath('SKILL.md');
  };

  const importZipFile = async (file: File) => {
    try {
      const pkg = await importPackageZip(file);
      await saveDraft(pkg);
      await refreshWorkspace();
      setPackage(pkg);
      setScreen('builder');
      setMessage(`Imported ${pkg.rootFolder}. Validation status: ${pkg.validationReport.status}.`);
    } catch (error) {
      setMessage(error instanceof ImportPackageError || error instanceof Error ? error.message : 'Import failed.');
    }
  };

  const exportBackup = async () => {
    const blob = await exportWorkspaceBackup();
    downloadBlob(blob, 'ai-skill-hub-workspace-backup.json');
  };

  const importBackup = async (file: File) => {
    try {
      const count = await importWorkspaceBackup(file);
      await refreshWorkspace();
      setMessage(`Imported ${count} packages from workspace backup.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Backup import failed.');
    }
  };

  const transitionStatus = (pkg: SkillPackage, status: LocalSkillStatus) => {
    const next = { ...pkg, localStatus: status, updatedAt: new Date().toISOString() };
    saveDraft(next).then(refreshWorkspace);
    if (pkg.id === activePackage.id) setPackage(next);
  };

  const openCatalogSkill = (skill: CatalogSkill) => {
    const pkg = createPackageFromCatalogSkill(skill);
    setPackage(pkg);
    setSelectedPath('SKILL.md');
    setScreen('builder');
    setMessage(`Opened ${skill.title || skill.name} from catalog.`);
  };

  const downloadCatalogSkill = async (skill: CatalogSkill) => {
    const pkg = createPackageFromCatalogSkill(skill);
    const blob = await exportPackageZip(pkg);
    downloadBlob(blob, `${pkg.rootFolder}-${pkg.metadata.version}.zip`);
    setMessage(`Downloaded ${skill.title || skill.name}.`);
  };

  const isDarkTheme = theme === 'dark';

  return (
    <div className="app-shell flex h-screen w-full overflow-hidden text-slate-900">
      <aside className="app-sidebar flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <img
              src="/brand/askillbuilder-logo.svg"
              alt="askillbuilder.com AI Skill Hub"
              className="h-12 w-12 shrink-0 rounded-md"
            />
            <div className="min-w-0">
              <div className="truncate text-base font-semibold tracking-tight text-slate-950">askillbuilder.com</div>
              <div className="mt-0.5 text-xs leading-snug text-slate-500">your trusted AI Skill Hub</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                  screen === item.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3 text-xs leading-relaxed text-slate-500">
          Static Cloudflare Pages target. Files stay in this browser unless exported.
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="app-topbar flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
          <div>
            <div className="text-sm font-semibold">{navItems.find((item) => item.id === screen)?.label}</div>
            <div className="text-xs text-slate-500">
              {saveState === 'saving' ? 'Autosaving...' : saveState === 'saved' ? 'Workspace saved locally' : saveState === 'error' ? 'Autosave failed' : 'Ready'}
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            {message && (
              <button onClick={() => setMessage('')} className="max-w-xl truncate rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                {message}
              </button>
            )}
            <button
              type="button"
              onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')}
              className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
              aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDarkTheme ? 'Light theme' : 'Dark theme'}
            >
              {isDarkTheme ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </header>

        {screen === 'catalog' && (
          <CatalogScreen
            catalog={catalog}
            workspace={workspace}
            onCreate={createFromTemplate}
            onOpen={openPackage}
            onOpenSkill={openCatalogSkill}
            onDownloadSkill={downloadCatalogSkill}
          />
        )}
        {screen === 'builder' && (
          <BuilderScreen
            pkg={activePackage}
            selectedFile={selectedFile}
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            onCreate={createFromTemplate}
            onAddFile={addFile}
            onRenameFile={renameFile}
            onDeleteFile={deleteFile}
            onRunValidation={runValidation}
            onExport={exportActivePackage}
            onUpdateFile={updateSelectedFile}
            articles={articles}
            onSubmit={() => transitionStatus(activePackage, 'submitted_local')}
          />
        )}
        {screen === 'import' && <ImportScreen onImportZip={importZipFile} />}
        {screen === 'workspace' && (
          <WorkspaceScreen
            packages={workspace}
            onOpen={openPackage}
            onDelete={async (id) => {
              await deletePackage(id);
              await refreshWorkspace();
            }}
            onExportBackup={exportBackup}
            onImportBackup={importBackup}
          />
        )}
        {screen === 'review' && <ReviewScreen packages={workspace} onOpen={openPackage} onTransition={transitionStatus} />}
        {screen === 'learn' && <LearnScreen articles={articles} />}
        {screen === 'composer' && (
          <div className="relative flex min-h-0 flex-1">
            <LibrarySidebar />
            <ReactFlowProvider>
              <Canvas />
            </ReactFlowProvider>
            <CartSidebar />
            <ConfigPanel />
          </div>
        )}
      </main>
    </div>
  );
}

function CatalogScreen({
  catalog,
  workspace,
  onCreate,
  onOpen,
  onOpenSkill,
  onDownloadSkill,
}: {
  catalog: CatalogSkill[];
  workspace: SkillPackage[];
  onCreate: (templateId: TemplateId) => void;
  onOpen: (pkg: SkillPackage) => void;
  onOpenSkill: (skill: CatalogSkill) => void;
  onDownloadSkill: (skill: CatalogSkill) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const categories = ['All', ...Array.from(new Set(catalog.map((item) => item.category)))];
  const localApproved = workspace.filter((pkg) => pkg.localStatus === 'approved_local');
  const results = catalog.filter((skill) => {
    const haystack = [skill.name, skill.description, skill.category, skill.tags?.join(' '), skill.compatibility?.join(' '), skill.content]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query.toLowerCase()) && (category === 'All' || skill.category === category);
  });
  const selectedSkill = results.find((skill) => skill.id === selectedSkillId) || results[0];
  const showDetails = isDetailsVisible && Boolean(selectedSkill);

  const toggleSkillDetails = (skill: CatalogSkill) => {
    if (isDetailsVisible && selectedSkillId === skill.id) {
      setIsDetailsVisible(false);
      return;
    }

    setSelectedSkillId(skill.id);
    setIsDetailsVisible(true);
  };

  return (
    <section className={`grid min-h-0 flex-1 overflow-hidden ${showDetails ? 'grid-cols-[minmax(0,1fr)_380px]' : 'grid-cols-1'}`}>
      <div className="min-h-0 overflow-y-auto p-5">
        <div className="grid gap-3 md:grid-cols-4">
          {templates.map((template) => (
            <button key={template.id} onClick={() => onCreate(template.id)} className="rounded-md border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-slate-400">
              <FilePlus2 size={18} className="mb-3 text-slate-600" />
              <div className="text-sm font-semibold">{template.name}</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-500">{template.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-white p-3">
          <Search size={16} className="text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-64 flex-1 bg-transparent text-sm outline-none" placeholder="Search static catalog by task, tag, compatibility..." />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        {localApproved.length > 0 && (
          <div className="mt-4">
            <h2 className="mb-2 text-sm font-semibold">Local Approved</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {localApproved.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} onOpen={() => onOpen(pkg)} />)}
            </div>
          </div>
        )}

        <div className={`mt-4 grid gap-3 md:grid-cols-2 ${showDetails ? 'xl:grid-cols-3' : 'xl:grid-cols-4 2xl:grid-cols-5'}`}>
          {results.map((skill) => {
            const isSelected = showDetails && selectedSkill?.id === skill.id;
            return (
              <article key={skill.id} className={`rounded-md border bg-white p-4 shadow-sm ${isSelected ? 'border-blue-400 ring-2 ring-blue-500/15' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{skill.title || skill.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{skill.summary || skill.description}</p>
                  </div>
                  <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{skill.trustLevel || 'seed'}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {[skill.category, ...(skill.tags || []).slice(0, 3), ...(skill.compatibility || []).slice(0, 2)].map((tag) => (
                    <span key={tag} className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-500">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => toggleSkillDetails(skill)} className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium hover:bg-blue-50 hover:text-blue-700">
                    <Eye size={14} /> Details
                  </button>
                  <button onClick={() => onOpenSkill(skill)} className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700">
                    <FileCode2 size={14} /> Open
                  </button>
                  <button onClick={() => onDownloadSkill(skill)} className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium hover:bg-blue-50 hover:text-blue-700">
                    <Download size={14} /> ZIP
                  </button>
                </div>
              </article>
            );
          })}
          {results.length === 0 && (
            <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-500">No catalog skills match this search.</div>
          )}
        </div>
      </div>

      {showDetails && (
      <aside className="min-h-0 overflow-y-auto border-l border-slate-200 bg-white p-5">
        {selectedSkill && (
          <div>
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="text-sm font-semibold">Skill Details</div>
              <button
                type="button"
                onClick={() => setIsDetailsVisible(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                aria-label="Hide skill details"
                title="Hide details"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">{selectedSkill.category}</div>
                <h2 className="mt-2 text-xl font-semibold">{selectedSkill.title || selectedSkill.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{selectedSkill.description}</p>
              </div>
              <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{selectedSkill.trustLevel || 'seed'}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-slate-500">Version</div>
                <div className="mt-1">{selectedSkill.version || '0.1.0'}</div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-slate-500">Risk</div>
                <div className="mt-1">{selectedSkill.riskLevel || 'unknown'}</div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-slate-500">Author</div>
                <div className="mt-1">{selectedSkill.author || 'AI Skill Hub'}</div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold text-slate-500">Updated</div>
                <div className="mt-1">{selectedSkill.updatedAt || 'n/a'}</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {[...(selectedSkill.tags || []), ...(selectedSkill.compatibility || [])].map((tag) => (
                <span key={tag} className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-500">{tag}</span>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <button onClick={() => onOpenSkill(selectedSkill)} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                <FileCode2 size={16} /> Open in Builder
              </button>
              <button onClick={() => onDownloadSkill(selectedSkill)} className="flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-700">
                <Download size={16} /> ZIP
              </button>
            </div>

            <div className="prose-preview mt-5 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(catalogSkillContent(selectedSkill)) }} />
          </div>
        )}
      </aside>
      )}
    </section>
  );
}

function BuilderScreen({
  pkg,
  selectedFile,
  selectedPath,
  setSelectedPath,
  onCreate,
  onAddFile,
  onRenameFile,
  onDeleteFile,
  onRunValidation,
  onExport,
  onUpdateFile,
  articles,
  onSubmit,
}: {
  pkg: SkillPackage;
  selectedFile?: SkillPackage['files'][number];
  selectedPath: string;
  setSelectedPath: (path: string) => void;
  onCreate: (templateId: TemplateId) => void;
  onAddFile: () => void;
  onRenameFile: () => void;
  onDeleteFile: () => void;
  onRunValidation: () => void;
  onExport: () => void;
  onUpdateFile: (text: string) => void;
  articles: KnowledgeArticle[];
  onSubmit: () => void;
}) {
  const issues = [...pkg.validationReport.errors, ...pkg.validationReport.warnings, ...pkg.validationReport.infos];
  const blocking = pkg.validationReport.errors.length > 0;

  return (
    <section className="grid min-h-0 flex-1 grid-cols-[250px_minmax(0,1fr)_360px] grid-rows-[auto_minmax(0,1fr)_180px] overflow-hidden">
      <div className="col-span-3 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <div className="text-sm font-semibold">{pkg.metadata.name}</div>
          <div className="text-xs text-slate-500">{pkg.rootFolder}/ · {statusLabels[pkg.localStatus]} · {pkg.validationReport.status}</div>
        </div>
        <div className="flex items-center gap-2">
          <select onChange={(event) => onCreate(event.target.value as TemplateId)} value="" className="rounded-md border border-slate-200 bg-white px-2 py-2 text-sm">
            <option value="" disabled>New from template</option>
            {templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
          </select>
          <button onClick={onRunValidation} className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">
            <CheckCircle2 size={16} /> Validate
          </button>
          <button disabled={blocking} onClick={onSubmit} className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
            <PackageCheck size={16} /> Submit local
          </button>
          <button onClick={onExport} className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Download size={16} /> Export ZIP
          </button>
        </div>
      </div>

      <aside className="min-h-0 border-r border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-3">
          <span className="text-xs font-semibold uppercase text-slate-500">Package Files</span>
          <button onClick={onAddFile} className="rounded p-1 text-slate-500 hover:bg-slate-100"><FilePlus2 size={16} /></button>
        </div>
        <div className="space-y-1 overflow-y-auto p-2">
          {pkg.files.map((file) => (
            <button
              key={file.path}
              onClick={() => setSelectedPath(file.path)}
              className={`flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs ${selectedPath === file.path ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}
            >
              <span className="truncate">{file.path}</span>
              <span className="ml-2 shrink-0 opacity-60">{Math.ceil(file.size / 1024)} KB</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-h-0 flex-col bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 text-xs text-slate-300">
          <span>{selectedFile?.path || 'No file selected'}</span>
          <div className="flex gap-2">
            <button disabled={!selectedFile || selectedFile.path === 'SKILL.md'} onClick={onRenameFile} className="rounded border border-slate-700 px-2 py-1 disabled:opacity-40">Rename</button>
            <button disabled={!selectedFile || selectedFile.path === 'SKILL.md'} onClick={onDeleteFile} className="rounded border border-slate-700 px-2 py-1 disabled:opacity-40">Delete</button>
          </div>
        </div>
        <textarea
          value={selectedFile?.textContent || ''}
          onChange={(event) => onUpdateFile(event.target.value)}
          disabled={!selectedFile?.textContent && selectedFile?.kind === 'asset'}
          className="min-h-0 flex-1 resize-none bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none"
          spellCheck={false}
        />
      </div>

      <aside className="min-h-0 overflow-y-auto border-l border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Preview and Metadata</h2>
        <div className="mt-3 rounded-md border border-slate-200 p-3 text-xs leading-relaxed text-slate-600">
          <div><b>Name:</b> {pkg.metadata.name}</div>
          <div><b>Description:</b> {pkg.metadata.description}</div>
          <div><b>Compatibility:</b> {pkg.metadata.compatibility.join(', ')}</div>
          <div><b>License:</b> {pkg.metadata.license}</div>
        </div>
        <div className="prose-preview mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(packageToSkillContent(pkg)) }} />
      </aside>

      <ValidationPanel issues={issues} status={pkg.validationReport.status} articles={articles} />
    </section>
  );
}

function ValidationPanel({ issues, status, articles }: { issues: ValidationIssue[]; status: string; articles: KnowledgeArticle[] }) {
  return (
    <div className="col-span-3 min-h-0 overflow-y-auto border-t border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <ShieldAlert size={16} />
        Validation: {status}
      </div>
      {issues.length === 0 ? (
        <div className="text-xs text-slate-500">No validation issues. Run validation after editing.</div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {issues.map((item, index) => {
            const article = articles.find((entry) => entry.id === item.docRef);
            return (
              <div key={`${item.code}-${index}`} className="rounded-md border border-slate-200 p-2 text-xs">
                <div className={`font-semibold ${item.severity === 'error' ? 'text-red-700' : item.severity === 'warning' ? 'text-amber-700' : 'text-slate-700'}`}>
                  {item.code} · {item.path || 'package'}
                </div>
                <div className="mt-1 text-slate-600">{item.message}</div>
                {item.suggestedFix && <div className="mt-1 text-slate-500">Fix: {item.suggestedFix}</div>}
                {article && <div className="mt-1 text-slate-400">Doc: {article.title}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ImportScreen({ onImportZip }: { onImportZip: (file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <section className="flex flex-1 items-center justify-center p-6">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) onImportZip(file);
        }}
        className={`flex h-96 w-full max-w-3xl cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-white p-8 text-center ${isDragging ? 'border-blue-500' : 'border-slate-300'}`}
      >
        <Upload size={32} className="text-slate-500" />
        <div className="mt-4 text-lg font-semibold">Upload a skill ZIP</div>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          Import runs entirely in the browser. The app rejects unsafe paths, duplicate normalized paths, and archives without one top-level skill folder.
        </p>
        <input type="file" accept=".zip,application/zip" className="hidden" onChange={(event) => event.target.files?.[0] && onImportZip(event.target.files[0])} />
      </label>
    </section>
  );
}

function WorkspaceScreen({
  packages,
  onOpen,
  onDelete,
  onExportBackup,
  onImportBackup,
}: {
  packages: SkillPackage[];
  onOpen: (pkg: SkillPackage) => void;
  onDelete: (id: string) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Local drafts and packages</h2>
          <p className="text-xs text-slate-500">Stored in IndexedDB in this browser.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onExportBackup} className="rounded-md border border-slate-300 px-3 py-2 text-sm">Export backup</button>
          <label className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            Import backup
            <input type="file" accept="application/json,.json" className="hidden" onChange={(event) => event.target.files?.[0] && onImportBackup(event.target.files[0])} />
          </label>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} onOpen={() => onOpen(pkg)} onDelete={() => onDelete(pkg.id)} />)}
      </div>
    </section>
  );
}

function ReviewScreen({
  packages,
  onOpen,
  onTransition,
}: {
  packages: SkillPackage[];
  onOpen: (pkg: SkillPackage) => void;
  onTransition: (pkg: SkillPackage, status: LocalSkillStatus) => void;
}) {
  const reviewPackages = packages.filter((pkg) => ['submitted_local', 'validated', 'rejected_local', 'blocked_local'].includes(pkg.localStatus));
  return (
    <section className="min-h-0 flex-1 overflow-y-auto p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold">Local review queue</h2>
        <p className="text-xs text-slate-500">This is a browser-local workflow. Approval does not publish to a shared registry.</p>
      </div>
      <div className="space-y-3">
        {reviewPackages.map((pkg) => (
          <div key={pkg.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4">
            <div>
              <div className="text-sm font-semibold">{pkg.metadata.name}</div>
              <div className="text-xs text-slate-500">{statusLabels[pkg.localStatus]} · {pkg.validationReport.errors.length} errors · {pkg.validationReport.warnings.length} warnings</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onOpen(pkg)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">Inspect</button>
              <button onClick={() => onTransition(pkg, 'approved_local')} className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white">Approve</button>
              <button onClick={() => onTransition(pkg, 'rejected_local')} className="rounded-md border border-slate-300 px-3 py-2 text-sm">Reject</button>
              <button onClick={() => onTransition(pkg, 'blocked_local')} className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700">Block</button>
            </div>
          </div>
        ))}
        {reviewPackages.length === 0 && <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-500">No local submissions yet.</div>}
      </div>
    </section>
  );
}

function LearnScreen({ articles }: { articles: KnowledgeArticle[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => articles.filter((article) => [article.title, article.summary, article.body, article.relatedErrorCodes.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase())),
    [articles, query],
  );
  const [selectedId, setSelectedId] = useState('');
  const selected = filtered.find((article) => article.id === selectedId) || filtered[0];

  return (
    <section className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)] overflow-hidden">
      <aside className="min-h-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles and error codes..." className="mb-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none" />
        <div className="space-y-2">
          {filtered.map((article) => (
            <button key={article.id} onClick={() => setSelectedId(article.id)} className={`w-full rounded-md p-3 text-left ${selected?.id === article.id ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-blue-50 hover:text-blue-700'}`}>
              <div className="text-sm font-semibold">{article.title}</div>
              <div className="mt-1 text-xs opacity-70">{article.summary}</div>
            </button>
          ))}
        </div>
      </aside>
      <article className="min-h-0 overflow-y-auto p-6">
        {selected && (
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase text-slate-500">{selected.category}</div>
            <h1 className="mt-2 text-2xl font-semibold">{selected.title}</h1>
            <p className="mt-2 text-sm text-slate-500">{selected.summary}</p>
            <div className="prose-preview mt-6 rounded-md border border-slate-200 bg-white p-5 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.body) }} />
          </div>
        )}
      </article>
    </section>
  );
}

function PackageCard({ pkg, onOpen, onDelete }: { key?: string; pkg: SkillPackage; onOpen: () => void; onDelete?: () => void }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{pkg.metadata.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{pkg.metadata.description}</p>
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{statusLabels[pkg.localStatus]}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {[pkg.metadata.category, ...pkg.metadata.tags, ...pkg.metadata.compatibility].slice(0, 5).map((tag) => (
          <span key={tag} className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-500">{tag}</span>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={onOpen} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">Open</button>
        {onDelete && <button onClick={onDelete} className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700">Delete</button>}
      </div>
    </article>
  );
}
