export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string; // The markdown content
  tags?: string[];
  compatibility?: string[];
  trustLevel?: TrustLevel;
  riskLevel?: RiskLevel;
  license?: string;
  version?: string;
}

export interface ConfiguredSkill extends Skill {
  cartId: string; // Unique ID for cart instance
}

export type SkillFileKind = 'markdown' | 'json' | 'text' | 'script' | 'asset' | 'binary';

export type LocalSkillStatus =
  | 'draft'
  | 'validated'
  | 'submitted_local'
  | 'approved_local'
  | 'rejected_local'
  | 'blocked_local';

export type ValidationStatus = 'not_run' | 'passed' | 'passed_with_warnings' | 'failed' | 'error';
export type ValidationSeverity = 'error' | 'warning' | 'info';
export type TrustLevel = 'seed' | 'local' | 'verified' | 'unverified' | 'approved_local';
export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export interface SkillMetadata {
  name: string;
  description: string;
  category: string;
  tags: string[];
  compatibility: string[];
  license: string;
  version: string;
}

export interface SkillFile {
  path: string;
  kind: SkillFileKind;
  mime: string;
  textContent?: string;
  binaryContent?: string;
  size: number;
}

export interface ValidationIssue {
  code: string;
  severity: ValidationSeverity;
  path: string | null;
  line?: number;
  message: string;
  suggestedFix?: string;
  docRef?: string;
}

export interface ValidationCheck {
  code: string;
  label: string;
  status: 'passed' | 'failed' | 'warning' | 'skipped';
  path?: string | null;
}

export interface ValidationReport {
  status: ValidationStatus;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  infos: ValidationIssue[];
  checks: ValidationCheck[];
  generatedAt: string;
}

export interface SkillPackage {
  id: string;
  rootFolder: string;
  metadata: SkillMetadata;
  files: SkillFile[];
  validationReport: ValidationReport;
  localStatus: LocalSkillStatus;
  createdAt: string;
  updatedAt: string;
  source: 'template' | 'import' | 'catalog' | 'canvas' | 'backup';
}

export interface CatalogSkill extends Skill {
  title: string;
  author: string;
  updatedAt: string;
  summary: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  body: string;
  relatedErrorCodes: string[];
}
