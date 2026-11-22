/*
 * Project write-ups. Each project gets its own folder here:
 *
 *   src/projects/
 *     slime-mold/
 *       index.jsx    ← the write-up
 *       hero.mp4     ← images, videos and other files it uses
 *
 * The folder name becomes the page's URL (/projects/slime-mold), and the
 * project's card in src/data/siteContent.js links to it when given the same
 * `slug`. New folders are picked up automatically; nothing else needs editing.
 *
 * To add one, copy the slime-mold folder, rename it, edit its index.jsx, and
 * add `slug: '<folder name>'` to the project in siteContent.js.
 *
 * index.jsx does `export default { ... }` with these fields:
 *
 *   title    – page heading (usually the same as the card)
 *   subtitle – one line under the title
 *   tags     – tools and topics, shown as pills under the subtitle
 *   links    – optional outside links shown right of the title and again at the
 *              end of the post, e.g. [{ label: 'Github', href: 'https://...' }].
 *              They open in a new tab.
 *   hero     – big image/GIF/video at the top: { src, video, alt, aspectRatio, label, caption }.
 *              `src` is an image or GIF. `video` (optional) is an imported video
 *              file that plays muted on a loop like a GIF; `src` then shows
 *              until it starts, so make it the video's first frame or the
 *              switch will flash (ffmpeg -i hero.mp4 -frames:v 1 hero-poster.jpg). `aspectRatio` (optional, default '2') is the
 *              box's shape, e.g. '16 / 9' for a 1280×720 video. `label` is
 *              optional text in its corner, e.g. '[GIF]'. `caption` (optional)
 *              is a line shown centred under it.
 *   sections – the body. Each has an `id` (used for the table of contents
 *              link), a `title`, and a `body` written as JSX: <p>, <ul>,
 *              <h3>, <pre><code>, <figure>, links, etc. all work.
 *
 * Files in the folder are used by importing them at the top of index.jsx,
 * e.g. `import demo from './demo.mp4'`, then `<video src={demo} controls />`.
 */

// Vite finds every src/projects/<folder>/index.jsx when the site is built.
const modules = import.meta.glob('./*/index.jsx', { eager: true })

/** Every write-up, keyed by its folder name: { 'slime-mold': { title, ... }, ... } */
export const projectPosts = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => [path.split('/')[1], module.default]),
)
