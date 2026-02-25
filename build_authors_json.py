import os
import json
import re
import xml.etree.ElementTree as ET
from datetime import datetime

BASE_XML_FOLDER = "xml"
OUTPUT_FILE = "authors.json"
REPORT_FILE = "build_report.md"


def parse_tei_file(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    ns = {}
    if root.tag.startswith("{"):
        ns = {"tei": "http://www.tei-c.org/ns/1.0"}
        title = root.find(".//tei:title", ns)
        author = root.find(".//tei:author", ns)
        source_desc = root.find(".//tei:sourceDesc", ns)
        session = root.find('.//tei:publicationStmt/tei:p[@corresp="session"]', ns)
    else:
        title = root.find(".//title")
        author = root.find(".//author")
        source_desc = root.find(".//sourceDesc")
        session = root.find('.//publicationStmt/p[@corresp="session"]')

    description_text = ""
    if source_desc is not None:
        p_elements = source_desc.findall("tei:p", ns) if ns else source_desc.findall("p")
        if len(p_elements) >= 2:
            second_p = p_elements[1]
            if second_p.text:
                description_text = second_p.text.strip()

    return {
        "title": title.text.strip() if title is not None and title.text else "",
        "author": author.text.strip() if author is not None and author.text else "",
        "description": description_text,
        "session": session.text.strip() if session is not None and session.text else ""
    }


def extract_session_number(filename):
    match = re.search(r"_s(\d+)", filename)
    return int(match.group(1)) if match else 0


def build():
    if not os.path.isdir(BASE_XML_FOLDER):
        raise FileNotFoundError(f"Folder '{BASE_XML_FOLDER}' does not exist.")

    authors = []
    report = {
        "authors": 0,
        "files": 0,
        "missing_title": [],
        "missing_author": [],
        "missing_session": [],
        "missing_description": []
    }

    for folder in sorted(os.listdir(BASE_XML_FOLDER)):
        folder_path = os.path.join(BASE_XML_FOLDER, folder)

        if not os.path.isdir(folder_path):
            continue

        author_data = None
        sessions = []

        xml_files = sorted(
            [f for f in os.listdir(folder_path) if f.endswith(".xml")]
        )

        for file in xml_files:
            report["files"] += 1
            file_path = os.path.join(folder_path, file)
            metadata = parse_tei_file(file_path)

            if not metadata["title"]:
                report["missing_title"].append(file_path)

            if not metadata["author"]:
                report["missing_author"].append(file_path)

            if not metadata["session"]:
                report["missing_session"].append(file_path)

            if not metadata["description"]:
                report["missing_description"].append(file_path)

            if author_data is None:
                author_data = {
                    "path": folder,
                    "name": metadata["author"],
                    "title": metadata["title"],
                    "description": metadata["description"],
                    "sessions": []
                }

            sessions.append({
                "name": f"Session {metadata['session']}",
                "link": os.path.splitext(file)[0],
                "order": extract_session_number(file)
            })

        if author_data:
            sessions.sort(key=lambda x: x["order"])
            for s in sessions:
                del s["order"]

            author_data["sessions"] = sessions
            authors.append(author_data)
            report["authors"] += 1

    # Write authors.json
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(authors, f, indent=2, ensure_ascii=False)

    generate_report(report)


def generate_report(report):
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

    lines = []
    lines.append(f"# Build Report\n")
    lines.append(f"Generated: {now}\n")
    lines.append(f"## Summary\n")
    lines.append(f"- Authors processed: **{report['authors']}**")
    lines.append(f"- XML files processed: **{report['files']}**\n")

    def section(title, items):
        lines.append(f"## {title}")
        if items:
            for item in items:
                lines.append(f"- {item}")
        else:
            lines.append("✓ None")
        lines.append("")

    section("Missing Title", report["missing_title"])
    section("Missing Author", report["missing_author"])
    section("Missing Session Number", report["missing_session"])
    section("Missing Description", report["missing_description"])

    report_content = "\n".join(lines)

    # Write markdown report
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        f.write(report_content)

    # If running in GitHub Actions → attach to job summary
    github_summary = os.getenv("GITHUB_STEP_SUMMARY")
    if github_summary:
        with open(github_summary, "a", encoding="utf-8") as f:
            f.write(report_content)


if __name__ == "__main__":
    build()
    print("✓ authors.json rebuilt")
    print("✓ build_report.md generated")
