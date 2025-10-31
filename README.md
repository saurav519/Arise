# AI Brainstorm Tool

Transform your brainstorming sessions with AI-powered insights and structured ideation. This interactive tool helps teams and individuals generate contextual ideas, analyze competitive landscapes, and develop strategic thinking—all through an intuitive, beautiful interface.

## ✨ Key Features

- 🎯 **Smart Ideation**: Generate contextual ideas based on your business goals and timeline
- 🔄 **Competitive Analysis**: Get instant insights about your market position and competitors
- 💡 **Priority Sorting**: Ideas are automatically prioritized by impact and effort
- 🎨 **Beautiful UI**: Modern, responsive interface built with Next.js and Tailwind CSS
- ⚡ **Real-time Updates**: Instant idea generation with smooth, dynamic updates
- 📱 **Mobile-friendly**: Works seamlessly across all devices and screen sizes

Perfect for product managers, entrepreneurs, marketing teams, and anyone looking to enhance their strategic planning process with AI assistance.

## Quick overview

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Entry: `app/` directory (Next 13+ App Router)

## Prerequisites

- Node.js (v16.8+ recommended)
- npm (or yarn/pnpm)

## Local development (Windows PowerShell)

Open PowerShell in the project root and run:

```powershell
# install dependencies
npm install

# start development server
npm run dev
```

The dev server typically runs at http://localhost:3000.

## Build & production

```powershell
npm run build
npm start
```

(If `npm start` is not defined in `package.json`, use `npm run start` or a host-specific command; check `package.json` scripts.)

## Project structure (important files)

- `app/` – Next.js App Router routes and pages
  - `layout.js` – global layout (you are currently editing this file)
  - `page.js` – main page
  - `globals.css` – global styles
- `components/BrainstormTool.js` – main Brainstorm UI component
- `next.config.js`, `tailwind.config.js`, `postcss.config.js` – configuration files
- `package.json` – scripts and dependencies

## Developing

- Edit UI in `components/BrainstormTool.js` and pages in `app/`.
- Tailwind is already configured; update classes in JSX and `globals.css`.

## Notes & tips

- If you add environment variables (for example, an AI API key), add them to a `.env.local` file and do not commit that file.
- For TypeScript, you can add `tsconfig.json` and convert files to `.tsx`/`.ts`.

## Troubleshooting

- If the dev server doesn't start, check Node version and run `npm install` again.
- If CSS is missing, ensure Tailwind is configured in `postcss.config.js` and `tailwind.config.js`.

## License

This project has no license specified. Add a `LICENSE` file if you want to make one explicit.

---

If you want, I can also:
- add a short `README` section describing the main component API,
- add a `CONTRIBUTING.md` or a minimal `LICENSE`, or
- update `package.json` scripts to include a `start` script for production.

Tell me which of those you'd like next.