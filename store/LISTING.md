# Store listing draft — MAGLA Chat Starter

## Short description

Insert your reusable first chat message with one click. Local-only, no auto-send.

## Full description

MAGLA Chat Starter removes the small but repeated task of pasting the same opening message into every new AI chat.

Set your short start phrase, paste your own plugin/tool list, and keep the template you want. When a chat composer is empty, click `MAGLA · старт` or use the extension popup. The message is inserted for your review; it is never sent automatically.

The first release supports ChatGPT, including the legacy chat.openai.com host.
Other AI chat adapters can be added only after separate compatibility testing.

Privacy by design:

- no chat history collection;
- no network requests;
- no analytics;
- only local browser storage for your settings.

## Review-safe permission explanation

`storage` saves the local template. `activeTab` allows the popup to address the active tab after the user clicks the extension. Host access is limited to ChatGPT because the in-page button needs to see its composer.

## Screenshot checklist

1. Settings page with phrase, plugin list, and preview.
2. Empty ChatGPT composer with `MAGLA · старт` button.
3. Popup after successful insertion showing “не отправляет”.
