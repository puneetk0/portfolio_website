# media-source

Files kept out of `public/` so they are **not** copied into the production
bundle, but not deleted either — several are candidate case-study evidence.

Vite copies everything under `public/` verbatim into `dist/`, so an unreferenced
26MB video ships to every visitor. Anything here is available for the evidence
pass; move a file back under `public/assets/` once it's actually referenced.

## Videos (need transcoding before use)
`ffmpeg` is not installed on this machine. Before putting any of these back:

```bash
ffmpeg -i input.mp4 -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 26 \
  -preset slow -movflags +faststart -an output.mp4
```

- `progress.mp4` — likely the missing Camber before/after evidence
- `a.mp4`, `bla.mp4` — unidentified, review before discarding

## Stale duplicates
`voca-a/b/c.png` are the pre-edit copies of the three tracked `voca-*.png`
files (byte sizes match exactly). Safe to delete once the current versions are
committed.

`camber-a.png` / `camber-b.png` are unreferenced; `camber-b.png` was 6.6MB.

`designx.HEIC` is a camera original — browsers cannot decode HEIC, and a
downscaled `designx.jpeg` already exists and is the one actually used.

## Resume
`stray-resume-from-find-my-repo.pdf` (3.5MB) was sitting inside
`public/assets/find-my-repo/` — a project asset folder — and is a *different
file* from `public/assets/resume/Resume-Puneet Kathuria (30).pdf` (89KB).

Neither was referenced: `SOCIAL_LINKS` points at a Google Drive URL instead, so
there are three sources of truth for the resume. Decide which is current, then
either serve it locally (faster, no Drive interstitial for recruiters) or delete
the local copies. Left as-is here rather than guessed at.
