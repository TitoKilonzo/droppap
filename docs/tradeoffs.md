# Trade-offs and known limitations

- Fonts use a system stack instead of a hosted font so builds work offline and add no third-party request.
- Tailwind 4 with CSS tokens in `src/styles/globals.css` instead of a JS config.
- Navigation lists only routes that exist. Later milestones add entries in `components/layout/nav.ts`.
- The dev workspace bridge (`ALLOW_DEV_WORKSPACE`) is temporary and removed when sessions exist.
- Local file databases are for development only; production requires a remote Turso URL.
- Dark mode is not implemented (the specification allows omitting it).
- Multipart uploads are deferred; a tested single-upload size limit will be enforced in Milestone 3.
- Service worker and offline page are planned for Milestone 5; no authenticated data will be cached.
