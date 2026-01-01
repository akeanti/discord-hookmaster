<div align="center">

# Discord HookMaster
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

A client-side tool to draft, preview, and send Discord webhooks.

Most webhook tools don't render embeds exactly how Discord does. HookMaster focuses on accurate previews (dark mode included) so you don't have to spam your test server to see if an image aligns correctly.

### Features

* **Visual & JSON Editing:** Bi-directional syncing. Tweak the UI or paste raw JSON; both update in real-time.
* **Accurate Preview:** Simulates the actual Discord client rendering for embeds, buttons, and select menus.
* **Safety First:** Controls for `allowed_mentions` so you don't accidentally ping `@everyone`.
* **Thread Support:** Post directly to forum threads or create new ones.
* **Utilites:** Local history storage, timestamp generator, and drag-and-drop file attachments.

### Tech Stack

Built with **React**, **TypeScript**, and **Tailwind CSS**.

### Running Locally

```bash
# Clone and install
git clone https://github.com/akeanti/discord-hookmaster.git
cd discord-hookmaster
npm install

# Start dev server
npm run dev

```

### Contributing

Pull requests are welcome. If you're adding UI elements, please stick to the existing Discord-native design patterns (colors/spacing) found in `types.ts` and the Tailwind config.

**License:** MIT
