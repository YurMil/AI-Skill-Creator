import { SkillFile, SkillPackage, ValidationIssue, ValidationReport } from '../types';
import { ALLOWED_TOP_LEVEL_FOLDERS, isPathTraversal, normalizePath, slugifySkillName } from './packageUtils';

const MAX_ARCHIVE_SIZE = 25 * 1024 * 1024;
const MAX_FILE_COUNT = 500;
const MAX_SKILL_MD_SIZE = 500 * 1024;
const MAX_TEXT_FILE_SIZE = 2 * 1024 * 1024;

const DOCS: Record<string, string> = {
  MISSING_SKILL_MD: 'validation-errors',
  MULTIPLE_SKILL_MD: 'validation-errors',
  MULTIPLE_TOP_LEVEL_FOLDERS: 'zip-import-troubleshooting',
  PATH_TRAVERSAL_DETECTED: 'zip-import-troubleshooting',
  INVALID_YAML_FRONTMATTER: 'skill-frontmatter',
  MISSING_NAME: 'skill-frontmatter',
  MISSING_DESCRIPTION: 'skill-frontmatter',
  INVALID_SKILL_NAME: 'naming-rules',
  DESCRIPTION_TOO_VAGUE: 'description-writing',
  INVALID_METADATA_JSON: 'skill-structure',
  BROKEN_LOCAL_REFERENCE: 'references-scripts-assets',
  ARCHIVE_TOO_LARGE: 'zip-import-troubleshooting',
  TOO_MANY_FILES: 'zip-import-troubleshooting',
  UNSUPPORTED_FILE_TYPE: 'safe-scripts',
  SUSPECTED_SECRET: 'safe-scripts',
  SCRIPT_REQUIRES_REVIEW: 'safe-scripts',
  SUSPICIOUS_INSTRUCTION: 'safe-scripts',
};

export interface ParsedFrontmatter {
  data: Record<string, string>;
  body: string;
  error?: string;
}

const issue = (
  code: string,
  severity: ValidationIssue['severity'],
  message: string,
  path: string | null,
  suggestedFix?: string,
  line?: number,
): ValidationIssue => ({
  code,
  severity,
  path,
  line,
  message,
  suggestedFix,
  docRef: DOCS[code],
});

export const parseSkillFrontmatter = (content: string): ParsedFrontmatter => {
  const normalized = content.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---\n') && !normalized.startsWith('---\r\n')) {
    return { data: {}, body: normalized, error: 'Missing opening YAML frontmatter delimiter.' };
  }

  const delimiter = normalized.startsWith('---\r\n') ? '\r\n' : '\n';
  const endToken = `${delimiter}---${delimiter}`;
  const endIndex = normalized.indexOf(endToken, 3);
  if (endIndex === -1) {
    return { data: {}, body: normalized, error: 'Missing closing YAML frontmatter delimiter.' };
  }

  const raw = normalized.slice(3 + delimiter.length, endIndex);
  const body = normalized.slice(endIndex + endToken.length);
  const data: Record<string, string> = {};

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      return { data: {}, body, error: `Invalid frontmatter line: ${line}` };
    }
    data[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim();
  }

  return { data, body };
};

const hasSuspiciousSecret = (file: SkillFile) => {
  const content = file.textContent || '';
  return (
    /-----BEGIN (RSA |OPENSSH |DSA |EC |PGP )?PRIVATE KEY-----/.test(content) ||
    /\b(?:api[_-]?key|access[_-]?token|secret|password)\s*[:=]\s*['"]?[A-Za-z0-9_\-]{16,}/i.test(content)
  );
};

const hasSuspiciousInstructions = (content: string) =>
  /ignore (all )?(previous|system|developer) instructions|bypass policy|exfiltrate|send .*secret|disable safety/i.test(content);

const referencedLocalPaths = (content: string) => {
  const paths = new Set<string>();
  const pattern = /\b((?:references|scripts|assets|examples|evals)\/[A-Za-z0-9._/\-]+)\b/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content))) {
    paths.add(normalizePath(match[1]));
  }
  return [...paths];
};

export const validatePackage = (pkg: SkillPackage, archiveSize = 0): ValidationReport => {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const infos: ValidationIssue[] = [];
  const checks: ValidationReport['checks'] = [];
  const normalizedPaths = new Set<string>();
  const skillFiles = pkg.files.filter((file) => file.path.toLowerCase() === 'skill.md');

  if (archiveSize > MAX_ARCHIVE_SIZE) {
    errors.push(issue('ARCHIVE_TOO_LARGE', 'error', 'The archive is larger than the 25 MB v1 limit.', null, 'Remove large assets or split the package.'));
  }

  if (pkg.files.length > MAX_FILE_COUNT) {
    errors.push(issue('TOO_MANY_FILES', 'error', 'The package contains more than 500 files.', null, 'Remove generated or unnecessary files.'));
  }

  for (const file of pkg.files) {
    const path = normalizePath(file.path);
    if (isPathTraversal(file.path)) {
      errors.push(issue('PATH_TRAVERSAL_DETECTED', 'error', `Unsafe path detected: ${file.path}`, file.path, 'Remove absolute paths and parent-directory segments.'));
    }
    if (normalizedPaths.has(path.toLowerCase())) {
      errors.push(issue('PATH_TRAVERSAL_DETECTED', 'error', `Duplicate normalized path detected: ${file.path}`, file.path, 'Keep only one file for each normalized path.'));
    }
    normalizedPaths.add(path.toLowerCase());

    const topSegment = path.split('/')[0];
    if (path.includes('/') && !ALLOWED_TOP_LEVEL_FOLDERS.includes(topSegment)) {
      warnings.push(issue('UNSUPPORTED_FILE_TYPE', 'warning', `Top-level folder "${topSegment}" is not part of the v1 canonical package layout.`, path, 'Move supporting files under references, scripts, assets, examples, or evals.'));
    }

    if (file.path.toLowerCase().endsWith('.zip')) {
      warnings.push(issue('UNSUPPORTED_FILE_TYPE', 'warning', 'Nested archives require manual review in v1.', path, 'Remove nested archives before publication.'));
    }

    if (file.textContent && file.size > MAX_TEXT_FILE_SIZE) {
      warnings.push(issue('UNSUPPORTED_FILE_TYPE', 'warning', `${file.path} is larger than the 2 MB text file limit.`, path, 'Move large reference material outside the package.'));
    }

    if (file.path.startsWith('.') || file.path.includes('/.')) {
      warnings.push(issue('UNSUPPORTED_FILE_TYPE', 'warning', 'Hidden files are review-only in v1.', path, 'Remove hidden files unless they are required and documented.'));
    }

    if (hasSuspiciousSecret(file)) {
      warnings.push(issue('SUSPECTED_SECRET', 'warning', `${file.path} may contain a credential or private key.`, path, 'Remove secrets before sharing this package.'));
    }

    if (file.kind === 'script') {
      warnings.push(issue('SCRIPT_REQUIRES_REVIEW', 'warning', `${file.path} is a script. AI Skill Hub does not execute imported scripts.`, path, 'Review script behavior before using this package.'));
    }
  }

  if (skillFiles.length === 0) {
    errors.push(issue('MISSING_SKILL_MD', 'error', 'The package must contain exactly one SKILL.md file.', null, 'Add SKILL.md at the package root.'));
  }

  if (skillFiles.length > 1) {
    errors.push(issue('MULTIPLE_SKILL_MD', 'error', 'The package contains multiple SKILL.md files.', null, 'Keep exactly one root-level SKILL.md file.'));
  }

  const skillFile = skillFiles[0];
  if (skillFile) {
    if (skillFile.size > MAX_SKILL_MD_SIZE) {
      errors.push(issue('UNSUPPORTED_FILE_TYPE', 'error', 'SKILL.md is larger than the 500 KB limit.', 'SKILL.md', 'Move long content into references/.'));
    }

    const parsed = parseSkillFrontmatter(skillFile.textContent || '');
    if (parsed.error) {
      errors.push(issue('INVALID_YAML_FRONTMATTER', 'error', parsed.error, 'SKILL.md', 'Use --- delimiters and key: value lines.', 1));
    } else {
      const name = parsed.data.name || '';
      const description = parsed.data.description || '';
      if (!name) {
        errors.push(issue('MISSING_NAME', 'error', 'SKILL.md frontmatter must include name.', 'SKILL.md', 'Add name: your-skill-name.', 2));
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
        errors.push(issue('INVALID_SKILL_NAME', 'error', `Skill name "${name}" must be lowercase hyphen-separated words.`, 'SKILL.md', `Use name: ${slugifySkillName(name)}.`, 2));
      }

      if (!description) {
        errors.push(issue('MISSING_DESCRIPTION', 'error', 'SKILL.md frontmatter must include description.', 'SKILL.md', 'Describe what the skill does and when to use it.', 3));
      } else if (description.length < 40 || /^(helps with tasks|does everything|useful skill)$/i.test(description)) {
        warnings.push(issue('DESCRIPTION_TOO_VAGUE', 'warning', 'The description is too short or vague for reliable discovery.', 'SKILL.md', 'Mention concrete task contexts and activation conditions.', 3));
      }

      if (!parsed.body.trim() || parsed.body.trim().length < 40) {
        warnings.push(issue('DESCRIPTION_TOO_VAGUE', 'warning', 'SKILL.md body should include a practical workflow.', 'SKILL.md', 'Add workflow steps, assumptions, and output expectations.'));
      }

      if (hasSuspiciousInstructions(parsed.body)) {
        warnings.push(issue('SUSPICIOUS_INSTRUCTION', 'warning', 'SKILL.md contains instructions that may override safety or higher-priority guidance.', 'SKILL.md', 'Remove hidden behavior, policy bypass, or exfiltration instructions.'));
      }

      const existingPaths = new Set(pkg.files.map((file) => normalizePath(file.path).toLowerCase()));
      referencedLocalPaths(skillFile.textContent || '').forEach((refPath) => {
        if (!existingPaths.has(refPath.toLowerCase())) {
          warnings.push(issue('BROKEN_LOCAL_REFERENCE', 'warning', `Referenced file ${refPath} does not exist.`, 'SKILL.md', 'Add the file or update the reference.'));
        }
      });
    }
  }

  const metadata = pkg.files.find((file) => file.path.toLowerCase() === 'metadata.json');
  if (metadata?.textContent) {
    try {
      JSON.parse(metadata.textContent);
    } catch {
      errors.push(issue('INVALID_METADATA_JSON', 'error', 'metadata.json is not valid JSON.', 'metadata.json', 'Fix JSON syntax or remove metadata.json.'));
    }
  }

  checks.push({
    code: 'PACKAGE_STRUCTURE',
    label: 'Package has a safe canonical structure',
    status: errors.some((item) => ['MISSING_SKILL_MD', 'MULTIPLE_SKILL_MD', 'PATH_TRAVERSAL_DETECTED'].includes(item.code)) ? 'failed' : 'passed',
  });
  checks.push({
    code: 'FRONTMATTER',
    label: 'SKILL.md frontmatter is parseable and complete',
    status: errors.some((item) => ['INVALID_YAML_FRONTMATTER', 'MISSING_NAME', 'MISSING_DESCRIPTION', 'INVALID_SKILL_NAME'].includes(item.code)) ? 'failed' : 'passed',
    path: 'SKILL.md',
  });
  checks.push({
    code: 'SECURITY_LITE',
    label: 'Package passed lightweight local security warnings',
    status: warnings.some((item) => ['SUSPECTED_SECRET', 'SCRIPT_REQUIRES_REVIEW', 'SUSPICIOUS_INSTRUCTION'].includes(item.code)) ? 'warning' : 'passed',
  });

  return {
    status: errors.length > 0 ? 'failed' : warnings.length > 0 ? 'passed_with_warnings' : 'passed',
    errors,
    warnings,
    infos,
    checks,
    generatedAt: new Date().toISOString(),
  };
};
