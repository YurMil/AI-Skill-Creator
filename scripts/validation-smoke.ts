import { createPackage } from '../src/lib/packageUtils';
import { createPackageFromTemplate } from '../src/lib/templates';
import { validatePackage } from '../src/lib/validation';

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

const valid = createPackageFromTemplate(
  'minimal',
  'csv-analysis-reporter',
  'Analyze CSV files and generate structured markdown reports. Use when the user needs metrics, trends, or anomalies from tabular data.',
);
const validReport = validatePackage(valid);
assert(validReport.status === 'passed', `Expected valid package to pass, got ${validReport.status}`);

const missingSkill = createPackage(
  {
    name: 'missing-entrypoint',
    description: 'This package intentionally has no entrypoint for validation testing.',
  },
  [],
  'template',
);
const missingReport = validatePackage(missingSkill);
assert(missingReport.errors.some((item) => item.code === 'MISSING_SKILL_MD'), 'Expected MISSING_SKILL_MD.');

const invalidName = createPackageFromTemplate('minimal', 'CSV Analyzer', 'Use this skill when an agent needs a CSV report from tabular data.');
const invalidReport = validatePackage({
  ...invalidName,
  files: invalidName.files.map((file) =>
    file.path === 'SKILL.md'
      ? {
          ...file,
          textContent: file.textContent?.replace('name: csv-analyzer', 'name: CSV Analyzer'),
        }
      : file,
  ),
});
assert(invalidReport.errors.some((item) => item.code === 'INVALID_SKILL_NAME'), 'Expected INVALID_SKILL_NAME.');

const vagueDescription = createPackageFromTemplate('minimal', 'vague-helper', 'helps with tasks');
const vagueReport = validatePackage(vagueDescription);
assert(vagueReport.warnings.some((item) => item.code === 'DESCRIPTION_TOO_VAGUE'), 'Expected DESCRIPTION_TOO_VAGUE warning.');

console.log('validation smoke tests passed');
