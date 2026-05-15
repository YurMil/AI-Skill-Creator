import { SkillPackage } from '../types';
import { createPackage, createTextFile, slugifySkillName } from './packageUtils';

export type TemplateId = 'minimal' | 'reference-heavy' | 'script-assisted' | 'eval-ready';

export const templates = [
  {
    id: 'minimal' as const,
    name: 'Minimal Skill',
    description: 'A compact SKILL.md-only package for instruction-driven agent behavior.',
  },
  {
    id: 'reference-heavy' as const,
    name: 'Reference Driven',
    description: 'A skill with references for domain rules, examples, and style guidance.',
  },
  {
    id: 'script-assisted' as const,
    name: 'Script Assisted',
    description: 'A reviewed package shape for deterministic local scripts.',
  },
  {
    id: 'eval-ready' as const,
    name: 'Eval Ready',
    description: 'A skill with examples and eval fixtures for quality checks.',
  },
];

const skillMarkdown = (name: string, description: string, body: string) => `---
name: ${slugifySkillName(name)}
description: ${description}
---

# Workflow

${body}

# Quality Checks

- Confirm required inputs are available before acting.
- Prefer deterministic scripts or references when they are included.
- Summarize assumptions and outputs clearly.
`;

export const createPackageFromTemplate = (
  templateId: TemplateId,
  name = 'custom-agent-skill',
  description = 'Use this skill when an agent needs a focused reusable workflow.',
): SkillPackage => {
  const normalizedName = slugifySkillName(name);
  const files = [
    createTextFile(
      'SKILL.md',
      skillMarkdown(
        normalizedName,
        description,
        '1. Read the user request and identify whether this skill applies.\n2. Follow the steps below using local files and provided context.\n3. Produce a concise result with any important caveats.',
      ),
    ),
    createTextFile('README.md', `# ${normalizedName}\n\n${description}\n`),
    createTextFile('metadata.json', JSON.stringify({
      category: 'Custom',
      tags: ['agent', 'workflow'],
      compatibility: ['codex'],
      license: 'MIT',
      min_platform_version: '1.0.0',
    }, null, 2)),
  ];

  if (templateId === 'reference-heavy') {
    files.push(
      createTextFile('references/style-guide.md', '# Style Guide\n\n- Keep outputs structured.\n- Avoid unsupported assumptions.\n'),
      createTextFile('references/domain-rules.md', '# Domain Rules\n\nAdd detailed rules here.\n'),
      createTextFile('examples/example-prompts.md', '# Example Prompts\n\n- Use this skill to...\n'),
    );
  }

  if (templateId === 'script-assisted') {
    files.push(
      createTextFile('scripts/README.md', '# Scripts\n\nScripts are never executed by AI Skill Hub v1. Review before use.\n'),
      createTextFile('scripts/validate_input.py', 'def validate_input(value):\n    return bool(value)\n'),
    );
  }

  if (templateId === 'eval-ready') {
    files.push(
      createTextFile('examples/expected-outputs.md', '# Expected Outputs\n\nDescribe good and bad outputs here.\n'),
      createTextFile('evals/evals.json', JSON.stringify({
        evals: [
          {
            id: 'eval-001',
            prompt: 'Run the core workflow on a simple request.',
            expected_checks: ['response follows the workflow', 'response includes caveats'],
          },
        ],
      }, null, 2)),
    );
  }

  return createPackage(
    {
      name: normalizedName,
      description,
      category: 'Custom',
      tags: ['agent', 'workflow'],
      compatibility: ['codex'],
      license: 'MIT',
      version: '0.1.0',
    },
    files,
    'template',
  );
};

export const packageFromSkillMarkdown = (name: string, description: string, content: string) =>
  createPackage(
    {
      name,
      description,
      category: 'Composed',
      tags: ['canvas'],
      compatibility: ['codex'],
      license: 'MIT',
      version: '0.1.0',
    },
    [createTextFile('SKILL.md', content)],
    'canvas',
  );
