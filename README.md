# Paccy — Frontend

Paccy is a college application workspace: track target colleges and deadlines, draft
essays (with optional AI feedback), log extracurriculars and coursework, and keep
everything on one calendar.

This repository is the web client. The API lives in
[paccy-io/paccy-backend](https://github.com/paccy-io/paccy-backend).

## Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

The API base URL is set in `config/api.ts` and points at the hosted API. Change it to
target your own backend instance.

## AI essay feedback

Essay evaluation calls the Google Gemini API directly from the browser using a key the
user pastes into **Settings → Preferences**. The key is kept in that browser's
`localStorage` and is never sent to the Paccy backend.

## License

[MIT](LICENSE)
