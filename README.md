# T3 Gallery

The codebase from Theo's [T3 App Router Tutorial on YouTube](https://github.com/t3dotgg/t3gallery)

## TODO

- [x] Make it deploy (vercel)
- [x] Scaffold basic ui with mock data
- [x] Tidy up build process
- [x] Actually set up a database (vercel postgres)
- [x] Attach database to UI
- [x] Add authentication (w/ clerk)
- [x] Add image upload
- [x] "taint" (server-only)
- [x] Use Next/Image component
- [x] Error management (w/ Sentry)
- [x] Routing/image page (parallel route)
- [x] Update upload button to be less cringe
- [x] Analytics (posthog)
- [x] Delete button (w/ Server Actions)
- [x] Ratelimiting (upstash)
- [x] Locking down upload (w/ clerk)

## Advanced Todo

- [x] Fix the page layout for images of different resolutions
- [x] "Selecting" images on the gallery page and applying actions to them at once (use client side state management)
- [ ] "infinite scroll"
- [ ] Folders/albums (add tags to each image)
- [ ] Redesign the app to look like [Hamed Bahram's photo gallery app](https://www.youtube.com/watch?v=RKszSrtWqjA)

## Debug or learn more about

- How Sentry.io works and why does it error
- How to simulate clerk auth using next-auth
- Why redirect("/") doesn't work with intercepted routes
- Why redirect("/") doesn't work when the source url is "/"
