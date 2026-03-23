import json
import re
import sys
from typing import Any


DANGEROUS_PATTERNS = [
    r"git\s+reset\s+--hard",
    r"git\s+checkout\s+--",
    r"git\s+clean\s+-fdx?",
    r"rm\s+-rf\s+(/|~|\.|\$PWD)",
    r"mkfs\b",
    r"dd\s+if=",
]


def read_payload() -> tuple[Any, str]:
    raw = sys.stdin.read()
    try:
        return json.loads(raw) if raw else {}, raw
    except Exception:
        return {}, raw


def collect_strings(value: Any) -> list[str]:
    found: list[str] = []
    if isinstance(value, str):
        found.append(value)
    elif isinstance(value, dict):
        for nested in value.values():
            found.extend(collect_strings(nested))
    elif isinstance(value, list):
        for nested in value:
            found.extend(collect_strings(nested))
    return found


def main() -> None:
    payload, raw = read_payload()
    haystack = "\n".join(collect_strings(payload))
    if raw:
        haystack += f"\n{raw}"

    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, haystack, flags=re.IGNORECASE):
            print(
                json.dumps(
                    {
                        "hookSpecificOutput": {
                            "hookEventName": "PreToolUse",
                            "permissionDecision": "ask",
                            "permissionDecisionReason": "Potentially destructive command detected. Request confirmation before running it."
                        },
                        "systemMessage": "Destructive shell operations should be explicitly confirmed in this workspace."
                    }
                )
            )
            return

    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "allow",
                    "permissionDecisionReason": "No destructive command pattern detected."
                }
            }
        )
    )


if __name__ == "__main__":
    main()