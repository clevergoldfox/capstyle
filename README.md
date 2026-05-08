# CapStylus Clone Theme Structure

This theme is organized for mirror-based local restoration/testing.

## Directories

- `mirror/`: downloaded site snapshot (pages/assets/endpoints)
- `inc/theme-setup.php`: theme supports and style enqueue
- `inc/mirror-renderer.php`: mirror route resolution + HTML rewrite + response output

## Core templates

- `front-page.php`: serves mirrored homepage or fallback message
- `index.php`: standard fallback loop for normal WordPress rendering
- `header.php` / `footer.php`: minimal wrappers used by fallback templates

## Refresh workflow

From project root, run one command:

- `.\refresh-mirror.ps1`

This performs a clean mirror crawl, captures endpoint responses, and updates `mirror/`.
