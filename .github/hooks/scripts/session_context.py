import json
from pathlib import Path


def load_package_json() -> dict:
    package_file = Path("package.json")
    if not package_file.exists():
        return {}

    try:
        return json.loads(package_file.read_text())
    except Exception:
        return {}


def main() -> None:
    package_json = load_package_json()
    dependencies = {
        **package_json.get("dependencies", {}),
        **package_json.get("devDependencies", {}),
    }

    technologies = []
    for name, label in [
        ("react", "React"),
        ("typescript", "TypeScript"),
        ("vite", "Vite"),
        ("react-router-dom", "React Router"),
        ("@tanstack/react-query", "React Query"),
        ("@trpc/react-query", "tRPC"),
        ("zustand", "Zustand"),
        ("sass", "SCSS"),
    ]:
        if name in dependencies:
            technologies.append(label)

    message = "Workspace context"
    if technologies:
        message += f": {', '.join(technologies)}."
    else:
        message += ": active frontend workspace."

    if Path("src/store/cartStore.ts").exists():
        message += " Cart state lives in src/store/cartStore.ts."
    if Path("src/api/routers/products.router.ts").exists():
        message += " Product/category data should stay on the tRPC router path."
    if Path("src/styles/variables.scss").exists():
        message += " Reuse shared SCSS variables and existing button styles."

    message += " Public API content may change, especially categories and image values."

    print(json.dumps({"systemMessage": message}))


if __name__ == "__main__":
    main()