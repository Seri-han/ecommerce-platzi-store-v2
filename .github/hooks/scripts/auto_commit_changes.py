import json
import os
import subprocess
from pathlib import Path


SOURCE_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".scss",
    ".css",
    ".json",
    ".md",
    ".yml",
    ".yaml",
}


def run_git(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        text=True,
        capture_output=True,
        check=False,
    )


def in_git_repo() -> bool:
    result = run_git(["rev-parse", "--is-inside-work-tree"])
    return result.returncode == 0 and result.stdout.strip() == "true"


def get_status_lines() -> list[str]:
    result = run_git(["status", "--porcelain"])
    if result.returncode != 0:
        return []
    return [line for line in result.stdout.splitlines() if line.strip()]


def extract_path(status_line: str) -> str:
    path_part = status_line[3:] if len(status_line) > 3 else ""

    if " -> " in path_part:
        return path_part.split(" -> ", 1)[1].strip()

    return path_part.strip()


def is_matching_file(path: str, source_only: bool) -> bool:
    if not path:
        return False

    if not source_only:
        return True

    return Path(path).suffix.lower() in SOURCE_EXTENSIONS


def get_matching_paths(status_lines: list[str], source_only: bool) -> list[str]:
    matching_paths: list[str] = []

    for line in status_lines:
        path = extract_path(line)
        if is_matching_file(path, source_only):
            matching_paths.append(path)

    return matching_paths


def build_commit_message(status_lines: list[str]) -> str:
    prefix = os.getenv("AUTO_COMMIT_MESSAGE_PREFIX", "chore: workspace updates").strip()

    added = 0
    modified = 0
    deleted = 0

    for line in status_lines:
        code = line[:2]
        if "A" in code or line.startswith("??"):
            added += 1
        elif "D" in code:
            deleted += 1
        else:
            modified += 1

    summary_parts = []
    if added:
        summary_parts.append(f"{added} added")
    if modified:
        summary_parts.append(f"{modified} updated")
    if deleted:
        summary_parts.append(f"{deleted} removed")

    if summary_parts:
        return f"{prefix} ({', '.join(summary_parts)})"

    return prefix


def main() -> None:
    enabled = os.getenv("AUTO_COMMIT_ENABLED", "false").lower() == "true"
    source_only = os.getenv("AUTO_COMMIT_ONLY_SOURCE_FILES", "false").lower() == "true"
    min_matching_files = int(os.getenv("AUTO_COMMIT_MIN_MATCHING_FILES", "1"))

    if not enabled:
        print(json.dumps({}))
        return

    if not Path(".git").exists() and not in_git_repo():
        print(json.dumps({"systemMessage": "Auto-commit hook skipped: not a git repository."}))
        return

    status_lines = get_status_lines()
    if not status_lines:
        print(json.dumps({}))
        return

    matching_paths = get_matching_paths(status_lines, source_only)
    if len(matching_paths) < min_matching_files:
        mode = "source files" if source_only else "files"
        print(
            json.dumps(
                {
                    "systemMessage": (
                        f"Auto-commit hook skipped: only {len(matching_paths)} matching {mode} changed; "
                        f"minimum required is {min_matching_files}."
                    )
                }
            )
        )
        return

    add_result = run_git(["add", "-A"])
    if add_result.returncode != 0:
        print(json.dumps({"systemMessage": f"Auto-commit hook failed during git add: {add_result.stderr.strip()}"}))
        return

    commit_message = build_commit_message(status_lines)
    commit_result = run_git(["commit", "-m", commit_message])

    if commit_result.returncode != 0:
        stderr = commit_result.stderr.strip()
        stdout = commit_result.stdout.strip()
        message = stderr or stdout or "git commit returned a non-zero exit code"
        print(json.dumps({"systemMessage": f"Auto-commit hook did not create a commit: {message}"}))
        return

    print(json.dumps({"systemMessage": f"Auto-commit hook created a commit: {commit_message}"}))


if __name__ == "__main__":
    main()