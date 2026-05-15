# Sandbox Execution Specification

## Purpose

Sandbox execution allows the platform to run selected validation and test tasks in an isolated environment. It is not required for the basic MVP, but the architecture should prepare for it.

## Use cases

- Run skill scripts with sample inputs.
- Run eval cases.
- Detect destructive behavior.
- Measure execution time and resource usage.
- Verify package examples.

## Safety principles

- Never run untrusted code on the API server.
- Use isolated containers or microVMs.
- Disable network by default.
- Mount a temporary filesystem.
- Limit CPU, memory, disk, and runtime.
- Drop privileges.
- Capture logs safely.
- Destroy environment after run.

## Execution policy

Default MVP policy:

```text
runtime_execution: disabled for public users
script_static_analysis: enabled
sandbox_execution: admin/reviewer only when available
network_access: disabled by default
```

Post-MVP policy:

```text
low_risk_markdown_only: no sandbox needed
medium_risk_scripts: sandbox required before verification
high_risk_network: manual review required
blocked_patterns: do not execute
```

## Sandbox limits

Recommended defaults:

```text
max_runtime_seconds: 30
max_memory_mb: 512
max_cpu_cores: 1
max_output_log_bytes: 1048576
network_enabled: false
filesystem_write_scope: /workspace/output only
```

## Input format

```json
{
  "skill_version_id": "uuid",
  "command": "python scripts/transform.py fixtures/input.csv",
  "fixtures": ["fixtures/input.csv"],
  "network_enabled": false,
  "timeout_seconds": 30
}
```

## Output format

```json
{
  "status": "completed",
  "exit_code": 0,
  "stdout_preview": "...",
  "stderr_preview": "...",
  "artifacts": [],
  "duration_ms": 1420,
  "resource_usage": {
    "memory_peak_mb": 84
  }
}
```

## Blocked operations

The sandbox should block or flag:

- Access outside mounted workspace.
- Attempts to read host secrets.
- Privilege escalation.
- Package manager installs unless explicitly allowed.
- Network access unless allowed.
- Long-running processes.
- Fork bombs.
- Large file writes.

## Reviewer UX

Reviewers should see:

- Command executed.
- Inputs used.
- Exit status.
- Logs preview.
- Generated artifacts.
- Resource usage.
- Security warnings.

## Audit

All sandbox runs must be recorded with:

- Actor.
- Skill version.
- Command.
- Policy.
- Result.
- Timestamp.
