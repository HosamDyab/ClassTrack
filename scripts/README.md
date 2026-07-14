# Scripts

Utility scripts for maintaining the ClassTrack project website.

## build-tutorial-data.py

Regenerates tutorial screenshots and `assets/js/tutorial-data.js` from source screen captures.

**Requirements:** Python 3.8+

**Usage:**

```bash
python scripts/build-tutorial-data.py
```

**Source folder:** By default the script reads from `../All ClassTrack Screens` on your Desktop. Override with:

```bash
set CLASSTRACK_SCREENS=C:\path\to\screens
python scripts/build-tutorial-data.py
```

**What it does:**

1. Copies images from role folders into `assets/images/screens/{student,faculty,admin}/`
2. Reads titles and descriptions from `screen-copy.json`
3. Writes `assets/js/tutorial-data.js`

The live site uses the committed `tutorial-data.js`. Run this script only when app screenshots or copy change.

## screen-copy.json

Metadata for all 128 tutorial screens: title, description, and tags per screen.
