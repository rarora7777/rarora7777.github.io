# Artwork intake

When new media files appear directly in `img/artwork/`:

1. Visually inspect each piece (including representative animation/video frames).
2. Use `_data/artwork.json` and existing artwork to choose the appropriate subfolder.
3. Rename to `NN-descriptive-subject.ext` using lowercase, hyphenated words, and
   move it there without changing its contents or overwriting files.
4. Append after the folder's highest numeric prefix unless the user requests
   another position. Preserve existing carousel order; leave organized art alone.
5. Run `node scripts/regenerate_artwork_data.js` from the repository root.
6. Verify paths and ordering, run `git diff --check`, and summarize the changes.
