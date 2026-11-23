# Explainer video

A 96-second animated walkthrough of the three demo stages, with Claude chat windows showing the prompts and results from [DEMO.md](../../DEMO.md).

- `matrix-mcp-explainer.mp4`: 1280×720, 30 fps
- `matrix-mcp-explainer.gif`: 800 px wide, 12 fps

## Re-render

The video is an HTML page (`source/index.html`) with a `render(t)` function, captured frame by frame with Playwright and encoded with ffmpeg.

```bash
cd docs/explainer/source
node render.js   # needs playwright and ffmpeg; writes matrix-mcp-explainer.mp4
ffmpeg -i matrix-mcp-explainer.mp4 -vf "fps=12,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" matrix-mcp-explainer.gif
```

Timings are the `data-in` / `data-out` seconds on each element. The Claude mark is from [Simple Icons](https://simpleicons.org) (CC0); Descope is shown as a text mark.
