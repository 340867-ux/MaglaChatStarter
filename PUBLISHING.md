# Publishing checklist

## Prepared

- Chrome/Edge package: `dist/MAGLA-Chat-Starter-chrome-v0.1.0.zip`
- Firefox package: `dist/MAGLA-Chat-Starter-firefox-v0.1.0.zip`
- Public source and release: [MaglaChatStarter](https://github.com/340867-ux/MaglaChatStarter)

## Store submission

1. Use the exact Chrome/Edge ZIP for Chromium stores.
2. Use the Firefox ZIP for AMO and provide the source when requested.
3. Add three screenshots: settings, empty composer button, successful insertion.
4. Publish the privacy text from `PRIVACY.md` at a stable public URL.
5. Ask only real users who found the extension useful for honest reviews.

The first release is ChatGPT-first with minimal host access. Claude/Gemini
support is intentionally held for a later compatibility-tested release.

Safari App Store distribution needs a separate Xcode Safari Web Extension
wrapper and an Apple Developer signing account; the current ZIP is not that
wrapper.
