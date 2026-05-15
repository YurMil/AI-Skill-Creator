import { nanoid } from 'nanoid';
import { SkillFile, SkillFileKind, SkillMetadata, SkillPackage, ValidationReport } from '../types';

export const ALLOWED_TOP_LEVEL_FOLDERS = ['references', 'scripts', 'assets', 'examples', 'evals'];

export const emptyValidationReport = (): ValidationReport => ({
  status: 'not_run',
  errors: [],
  warnings: [],
  infos: [],
  checks: [],
  generatedAt: new Date().toISOString(),
});

export const slugifySkillName = (value: string) => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return slug || 'untitled-skill';
};

export const normalizePath = (path: string) =>
  path.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/+/, '').trim();

export const isPathTraversal = (path: string) => {
  const normalized = normalizePath(path);
  return (
    path.startsWith('/') ||
    /^[a-zA-Z]:/.test(path) ||
    normalized.split('/').some((part) => part === '..')
  );
};

export const inferFileKind = (path: string): SkillFileKind => {
  const lower = path.toLowerCase();
  if (lower.endsWith('.md') || lower.endsWith('.markdown')) return 'markdown';
  if (lower.endsWith('.json')) return 'json';
  if (lower.startsWith('scripts/') || /\.(py|js|ts|sh|ps1|rb|go)$/.test(lower)) return 'script';
  if (/\.(png|jpg|jpeg|gif|webp|svg|pdf|pptx|docx|xlsx|zip)$/.test(lower)) return lower.endsWith('.zip') ? 'binary' : 'asset';
  if (/\.(txt|csv|yaml|yml|toml|xml|html|css)$/.test(lower)) return 'text';
  return 'text';
};

export const inferMime = (path: string) => {
  const lower = path.toLowerCase();
  if (lower.endsWith('.md')) return 'text/markdown';
  if (lower.endsWith('.json')) return 'application/json';
  if (lower.endsWith('.py')) return 'text/x-python';
  if (lower.endsWith('.js')) return 'text/javascript';
  if (lower.endsWith('.ts')) return 'text/typescript';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.zip')) return 'application/zip';
  return 'text/plain';
};

export const createTextFile = (path: string, textContent: string): SkillFile => ({
  path: normalizePath(path),
  kind: inferFileKind(path),
  mime: inferMime(path),
  textContent,
  size: new Blob([textContent]).size,
});

export const createPackage = (
  metadata: Partial<SkillMetadata>,
  files: SkillFile[],
  source: SkillPackage['source'] = 'template',
): SkillPackage => {
  const name = slugifySkillName(metadata.name || 'untitled-skill');
  const now = new Date().toISOString();
  const fullMetadata: SkillMetadata = {
    name,
    description: metadata.description || 'Describe when this skill should be used.',
    category: metadata.category || 'Custom',
    tags: metadata.tags || [],
    compatibility: metadata.compatibility || ['codex'],
    license: metadata.license || 'MIT',
    version: metadata.version || '0.1.0',
  };

  return {
    id: nanoid(),
    rootFolder: name,
    metadata: fullMetadata,
    files,
    validationReport: emptyValidationReport(),
    localStatus: 'draft',
    createdAt: now,
    updatedAt: now,
    source,
  };
};

export const getSkillFile = (pkg: SkillPackage) =>
  pkg.files.find((file) => file.path.toLowerCase() === 'skill.md');

export const packageToSkillContent = (pkg: SkillPackage) =>
  getSkillFile(pkg)?.textContent || '';

export const upsertPackageFile = (pkg: SkillPackage, file: SkillFile): SkillPackage => {
  const normalizedPath = normalizePath(file.path);
  const exists = pkg.files.some((item) => item.path === normalizedPath);
  return {
    ...pkg,
    files: exists
      ? pkg.files.map((item) => (item.path === normalizedPath ? { ...file, path: normalizedPath } : item))
      : [...pkg.files, { ...file, path: normalizedPath }],
    updatedAt: new Date().toISOString(),
  };
};

export const removePackageFile = (pkg: SkillPackage, path: string): SkillPackage => ({
  ...pkg,
  files: pkg.files.filter((file) => file.path !== normalizePath(path)),
  updatedAt: new Date().toISOString(),
});

export const renamePackageFile = (pkg: SkillPackage, oldPath: string, newPath: string): SkillPackage => {
  const normalizedOld = normalizePath(oldPath);
  const normalizedNew = normalizePath(newPath);
  return {
    ...pkg,
    files: pkg.files.map((file) =>
      file.path === normalizedOld
        ? {
            ...file,
            path: normalizedNew,
            kind: inferFileKind(normalizedNew),
            mime: inferMime(normalizedNew),
          }
        : file,
    ),
    updatedAt: new Date().toISOString(),
  };
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
