import os
import glob
import re

mapping = {
    "Home": "index.html",
    "Past Analyses": "past_analyses.html",
    "Library": "library.html",
    "Settings": "settings.html",
    "Account": "user_profile.html",
    "Help Center": "#"
}

files = glob.glob(os.path.join("frontend", "*.html"))

for fpath in files:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # We will search for typical combinations like:
    # <a ... href="#">... <span>Home</span> ... </a>
    # A simple regex to replace href="#" with the correct link within the <nav> or sidebar
    
    # Actually, a much safer regex for these sidebar links since they all literally say <span>Home</span> or similar
    for key, val in mapping.items():
        # Look for <a ... href="#">.*?<span>KEY</span>
        # We replace href="#" with href="VAL"
        # We can use a regex that matches `<a...href="#"...` up to `>KEY<` or `> KEY <` 
        pattern = re.compile(rf'(<a[^>]*href=")#("[^>]*>(?:(?!\s*</a>).)*>[ \t\r\n]*{re.escape(key)}[ \t\r\n]*<)', re.DOTALL | re.IGNORECASE)
        content = pattern.sub(rf'\1{val}\2', content)

    # Some templates might not have spans, just text inside
    for key, val in mapping.items():
        pattern2 = re.compile(rf'(<a[^>]*href=")#("[^>]*>[ \t\n\r]*(?:<[^>]+>[ \t\n\r]*[^<]*</[^>]+>[ \t\n\r]*)?{re.escape(key)}[ \t\n\r]*<)', re.IGNORECASE)
        content = pattern2.sub(rf'\1{val}\2', content)

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Updated {len(files)} files successfully.")
