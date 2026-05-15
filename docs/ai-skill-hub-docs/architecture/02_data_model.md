# Data Model

## Entity overview

```text
User
Organization
Membership
Skill
SkillVersion
SkillFile
SkillDraft
ValidationReport
SecurityReport
Review
Collection
KnowledgeBaseArticle
AuditLog
DownloadEvent
```

## users

```sql
id uuid primary key
email text unique not null
display_name text
avatar_url text
role text not null default 'user'
created_at timestamptz not null
updated_at timestamptz not null
```

## organizations

```sql
id uuid primary key
slug text unique not null
name text not null
plan text not null default 'free'
created_at timestamptz not null
updated_at timestamptz not null
```

## memberships

```sql
id uuid primary key
organization_id uuid not null references organizations(id)
user_id uuid not null references users(id)
role text not null
created_at timestamptz not null
unique (organization_id, user_id)
```

## skills

```sql
id uuid primary key
slug text unique not null
name text not null
title text not null
short_description text not null
long_description text
category text
visibility text not null default 'private'
author_id uuid not null references users(id)
organization_id uuid references organizations(id)
license text
trust_level text not null default 'unverified'
risk_score numeric
latest_version_id uuid
created_at timestamptz not null
updated_at timestamptz not null
```

## skill_versions

```sql
id uuid primary key
skill_id uuid not null references skills(id)
version text not null
status text not null
archive_url text not null
source_url text
content_hash text not null
file_count int not null
archive_size_bytes bigint not null
validation_status text
security_status text
changelog text
created_by uuid not null references users(id)
created_at timestamptz not null
unique (skill_id, version)
```

## skill_files

```sql
id uuid primary key
skill_version_id uuid not null references skill_versions(id)
path text not null
file_type text not null
size_bytes bigint not null
content_hash text not null
storage_url text
created_at timestamptz not null
unique (skill_version_id, path)
```

## skill_drafts

```sql
id uuid primary key
owner_id uuid not null references users(id)
organization_id uuid references organizations(id)
skill_id uuid references skills(id)
title text not null
file_tree jsonb not null
metadata jsonb not null
status text not null default 'draft'
created_at timestamptz not null
updated_at timestamptz not null
```

## validation_reports

```sql
id uuid primary key
skill_version_id uuid references skill_versions(id)
draft_id uuid references skill_drafts(id)
status text not null
errors jsonb not null default '[]'
warnings jsonb not null default '[]'
checks jsonb not null default '[]'
spec_version text
created_at timestamptz not null
```

## security_reports

```sql
id uuid primary key
skill_version_id uuid references skill_versions(id)
draft_id uuid references skill_drafts(id)
risk_level text not null
risk_score numeric
prompt_findings jsonb not null default '[]'
script_findings jsonb not null default '[]'
secret_findings jsonb not null default '[]'
network_findings jsonb not null default '[]'
recommendations jsonb not null default '[]'
created_at timestamptz not null
```

## reviews

```sql
id uuid primary key
skill_id uuid not null references skills(id)
skill_version_id uuid not null references skill_versions(id)
status text not null
submitted_by uuid not null references users(id)
reviewed_by uuid references users(id)
review_notes text
created_at timestamptz not null
updated_at timestamptz not null
```

## collections

```sql
id uuid primary key
owner_id uuid references users(id)
organization_id uuid references organizations(id)
slug text not null
name text not null
description text
visibility text not null default 'private'
created_at timestamptz not null
updated_at timestamptz not null
```

## collection_items

```sql
id uuid primary key
collection_id uuid not null references collections(id)
skill_id uuid not null references skills(id)
position int not null default 0
created_at timestamptz not null
unique (collection_id, skill_id)
```

## knowledge_base_articles

```sql
id uuid primary key
slug text unique not null
title text not null
summary text
body_md text not null
category text
tags text[] not null default '{}'
status text not null default 'draft'
created_by uuid references users(id)
created_at timestamptz not null
updated_at timestamptz not null
```

## audit_logs

```sql
id uuid primary key
actor_id uuid references users(id)
organization_id uuid references organizations(id)
action text not null
resource_type text not null
resource_id uuid
metadata jsonb not null default '{}'
created_at timestamptz not null
```

## Indexing recommendations

- Unique index on `skills.slug`.
- Composite index on `skills.visibility`, `skills.trust_level`, `skills.category`.
- GIN index on tags.
- Full-text index on name, title, descriptions.
- Index on `skill_versions.skill_id` and `skill_versions.created_at`.
- Index on `reviews.status`.
- Index on `audit_logs.organization_id`, `audit_logs.created_at`.
