# Search and Recommendation Specification

## Goals

The search system must help users find the best skill for a task based on meaning, metadata, compatibility, trust level, and safety.

## Search types

### Full-text search

Searches exact and partial terms across:

- Skill name.
- Title.
- Short description.
- Long description.
- Tags.
- Category.
- `SKILL.md` content.
- README.
- Examples.

### Faceted search

Filters results by:

- Category.
- Tags.
- Compatibility.
- Trust level.
- Risk level.
- License.
- Author.
- Organization.
- Date updated.

### Semantic search

Embeds user intent and compares it to skill descriptions, examples, and indexed package summaries.

### Recommendation

Uses a structured questionnaire and ranking model to suggest skills.

## Search ranking signals

Recommended ranking formula:

```text
score = text_relevance
      + semantic_similarity
      + trust_boost
      + compatibility_boost
      + freshness_boost
      + quality_boost
      - risk_penalty
      - deprecation_penalty
```

## Quality signals

- Has examples.
- Has evals.
- Has README.
- Validation passes.
- Security status is low risk.
- Clear description.
- Recent maintenance.
- Positive reviews.
- Verified author.

## Recommendation input

```json
{
  "task": "Create a report from uploaded CSV files",
  "agent_client": "openai-agents",
  "data_sensitivity": "internal",
  "requires_scripts": false,
  "risk_tolerance": "low",
  "preferred_license": "permissive"
}
```

## Recommendation output

```json
{
  "recommended": [
    {
      "skill_slug": "csv-analysis-reporter",
      "reason": "Matches CSV analysis and report generation without requiring scripts.",
      "fit_score": 0.92,
      "risk_level": "low",
      "trust_level": "verified"
    }
  ],
  "alternatives": [],
  "warnings": []
}
```

## Indexing pipeline

1. Skill version is created or approved.
2. Package metadata is extracted.
3. Text content is normalized.
4. Search document is built.
5. Full-text index is updated.
6. Embeddings are generated for semantic index.
7. Search availability status is updated.

## Search result card

Each result must show:

- Title.
- Short description.
- Category and tags.
- Trust level.
- Risk level.
- Compatibility.
- Latest version.
- Last updated date.
- Why this result matched.

## Query examples

- "skill for analyzing PDFs"
- "generate weekly status report"
- "safe skill without scripts for summarizing meeting notes"
- "OpenAI compatible spreadsheet skill"
- "MCP tool documentation skill"

## Failure behavior

If semantic search is unavailable, the system should still return full-text search results.

If no results are found, the system should offer:

- Related searches.
- Skill generator flow.
- Relevant knowledge base article.
