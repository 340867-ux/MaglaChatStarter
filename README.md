# MAGLA Chat Starter

Small local-first browser extension for the repetitive first message in a new AI chat.

It provides two explicit actions:

1. a toolbar popup button;
2. a small `MAGLA · старт` button beside an empty composer.

Both actions only insert the configured text. The user still presses Send.

## Configuration

The options page stores:

- a short starting phrase;
- a user-provided list of plugins/tools;
- a template using `{{phrase}}` and `{{plugins}}`.

## Supported pages

The first store submission is ChatGPT-first, including the legacy
chat.openai.com host. Claude and Gemini selectors remain isolated in the
content script for a later release after dedicated manual testing.

## Checks

```sh
npm test
npm run build
```

The build creates independent Chrome/Edge and Firefox ZIP packages in `dist/`.
