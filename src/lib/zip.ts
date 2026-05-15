import JSZip from 'jszip';
import { SkillFile, SkillPackage } from '../types';
import { createPackage, inferFileKind, inferMime, isPathTraversal, normalizePath, slugifySkillName } from './packageUtils';
import { validatePackage } from './validation';

const TEXT_EXTENSIONS = /\.(md|txt|json|yaml|yml|toml|csv|xml|html|css|js|ts|py|sh|ps1|rb|go)$/i;

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
};

const base64ToUint8Array = (value: string) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

export class ImportPackageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImportPackageError';
  }
}

export const importPackageZip = async (file: File): Promise<SkillPackage> => {
  if (!file.name.toLowerCase().endsWith('.zip')) {
    throw new ImportPackageError('Only .zip files are supported.');
  }

  const zip = await JSZip.loadAsync(file);
  const topFolders = new Set<string>();
  const normalizedPaths = new Set<string>();
  const files: SkillFile[] = [];

  for (const entry of Object.values(zip.files)) {
    const entryPath = normalizePath(entry.name);
    if (!entryPath || entry.dir) continue;

    if (isPathTraversal(entry.name)) {
      throw new ImportPackageError(`Unsafe path detected: ${entry.name}`);
    }

    const parts = entryPath.split('/');
    if (parts.length < 2) {
      throw new ImportPackageError('The archive must contain one top-level skill folder.');
    }

    topFolders.add(parts[0]);
    const relativePath = normalizePath(parts.slice(1).join('/'));
    if (normalizedPaths.has(relativePath.toLowerCase())) {
      throw new ImportPackageError(`Duplicate normalized path: ${relativePath}`);
    }
    normalizedPaths.add(relativePath.toLowerCase());

    const kind = inferFileKind(relativePath);
    const mime = inferMime(relativePath);
    if (TEXT_EXTENSIONS.test(relativePath) || ['markdown', 'json', 'text', 'script'].includes(kind)) {
      const textContent = await entry.async('text');
      files.push({
        path: relativePath,
        kind,
        mime,
        textContent,
        size: new Blob([textContent]).size,
      });
    } else {
      const buffer = await entry.async('arraybuffer');
      files.push({
        path: relativePath,
        kind,
        mime,
        binaryContent: arrayBufferToBase64(buffer),
        size: buffer.byteLength,
      });
    }
  }

  if (topFolders.size !== 1) {
    throw new ImportPackageError('The archive must contain exactly one top-level skill folder.');
  }

  const rootFolder = [...topFolders][0];
  const skillFile = files.find((item) => item.path.toLowerCase() === 'skill.md');
  const frontmatterName = skillFile?.textContent?.match(/\n?name:\s*([^\n\r]+)/)?.[1]?.trim();
  const frontmatterDescription = skillFile?.textContent?.match(/\n?description:\s*([^\n\r]+)/)?.[1]?.trim();

  const pkg = createPackage(
    {
      name: slugifySkillName(frontmatterName || rootFolder),
      description: frontmatterDescription || 'Imported local skill package.',
      category: 'Imported',
      tags: ['imported'],
      compatibility: ['codex'],
      license: 'Unknown',
      version: '0.1.0',
    },
    files,
    'import',
  );

  const validationReport = validatePackage(pkg, file.size);
  return {
    ...pkg,
    rootFolder: slugifySkillName(rootFolder),
    validationReport,
    localStatus: validationReport.status === 'passed' || validationReport.status === 'passed_with_warnings' ? 'validated' : 'draft',
  };
};

export const exportPackageZip = async (pkg: SkillPackage): Promise<Blob> => {
  const zip = new JSZip();
  const root = zip.folder(pkg.rootFolder || slugifySkillName(pkg.metadata.name));
  if (!root) throw new Error('Failed to create package root folder.');

  for (const file of pkg.files) {
    if (file.binaryContent) {
      root.file(file.path, base64ToUint8Array(file.binaryContent));
    } else {
      root.file(file.path, file.textContent || '');
    }
  }

  return zip.generateAsync({ type: 'blob' });
};
