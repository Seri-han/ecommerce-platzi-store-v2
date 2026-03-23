import json
import sys
from typing import Any


SOURCE_EXTENSIONS = (".ts", ".tsx", ".scss", ".css", ".json")
EDIT_KEYWORDS = ("edit", "patch", "write", "create", "update")


def read_payload() -> tuple[Any, str]:
    raw = sys.stdin.read()
    try:
        return json.loads(raw) if raw else {}, raw
    except Exception:
        return {}, raw


def collect_strings(value: Any) -> list[str]:
    results: list[str] = []
    if isinstance(value, str):
        results.append(value)
    elif isinstance(value, dict):
        for nested in value.values():
            results.extend(collect_strings(nested))
    elif isinstance(value, list):
        for nested in value:
            results.extend(collect_strings(nested))
    return results


def main() -> None:
    payload, raw = read_payload()
    strings = collect_strings(payload)
    blob = "\n".join(strings) + (f"\n{raw}" if raw else "")

    touched_source_file = any(text.endswith(SOURCE_EXTENSIONS) for text in strings)
    looks_like_edit = any(keyword in blob.lower() for keyword in EDIT_KEYWORDS)

    if touched_source_file and looks_like_edit:
        print(
            json.dumps(
                {
                    "systemMessage": "Code or style files were edited. Run targeted validation on touched files before finishing."
                }
            )
        )
        return

    print(json.dumps({}))


if __name__ == "__main__":
    main()