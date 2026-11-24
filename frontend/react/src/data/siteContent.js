/*
 * All of the text on the site lives in this file.
 * Edit the values here; the components read from it and never need to change
 * just to update wording, links, or projects.
 *
 * Images go in `public/images/`. A path like "/images/profile.jpg" points to
 * `public/images/profile.jpg`.
 */

export const navLinks = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Resume', href: '/#resume' },
  { label: 'Teaching', href: '/#teaching' },
  { label: 'Art', href: '/#art' },
]

export const profile = {
  name: 'Michael Wang',
  photo: '/images/profile.jpg',
  photoAlt: 'Portrait of Michael Wang',
  aboutHeading: 'About Me',
  // Each string is its own paragraph.
  bio: [
    'I am a Computer Science student at William & Mary. I am interested in ' +
      'data-efficient machine learning and building software that helps people. ' +
      'I enjoy presenting complex topics in approachable ways and working with others.',
  ],
  contacts: [
    {
      label: 'Email',
      text: 'michaelhwang424@gmail.com',
      href: 'mailto:michaelhwang424@gmail.com',
    },
    {
      label: 'LinkedIn',
      text: 'linkedin.com/in/mhwang424/',
      href: 'https://www.linkedin.com/in/mhwang424/',
    },
    {
      label: 'Github',
      text: 'github.com/Wung8',
      href: 'https://github.com/Wung8',
    },
  ],
}

/*
 * Resume section. Put the PDF at `public/resume.pdf` (or change `file` to
 * match its name). Clicking the link opens it in a new tab.
 */
export const resume = {
  heading: 'Resume',
  linkText: 'View my resume',
  file: '/Resume_Michael_Wang.pdf',
}

/*
 * To add a project, copy one of these objects and change its values.
 * Projects are shown in the order they appear here.
 *
 *   title       – card heading
 *   description – a sentence or two shown under the title
 *   year        – shown on the right of the card
 *   image       – screenshot path (optional; a blank placeholder shows if missing)
 *   href        – where the card links to (optional; opens in a new tab)
 *   slug        – opens the project's write-up at /projects/<slug> instead (optional).
 *                 The write-up lives in src/projects/<slug>/ (see src/projects/index.js).
 *   wip         – true shows a "WIP" pill even on a card that has a link (optional)
 *
 * Pills in the card's top-right corner are added automatically: "Blog" for a
 * slug, the GitHub logo for an href on github.com, and "WIP" for a card with
 * neither href nor slug (it isn't clickable yet) or with wip: true.
 */
export const projects = [
  {
    title: 'Reinforcement Learning Library',
    description: 'RL library implementing PPO and its implementation details from Pytorch.',
    year: 2024,
    image: '/images/projects/reinforcement-learning.png',
    slug: 'reinforcement-learning',
  },
  {
    title: 'Slime Mold Simulation',
    description: 'Highly vectorized implementation of the Slime Mold simulation.',
    year: 2026,
    image: '/images/projects/slime-mold.png',
    slug: 'slime-mold',
  },
  {
    title: 'Rainforest Pomodoro',
    description: 'Pomodoro app with playlist features and procedurally generated trees.',
    year: 2025,
    image: '/images/projects/rainforest-pomodoro.png',
    href: 'https://github.com/Wung8/RainforestPomodoro',
  },
  {
    title: 'AI Playground',
    description: 'Platform for hosting bot competitions and applied learning.',
    year: 2026,
    image: '/images/projects/aiplayground.png',
  },
  {
    title: 'RaidersAI',
    description: 'Browser-based game for experimenting with algorithmic decision-making AI.',
    year: 2026,
    image: '/images/projects/raidersai.png',
  },
  {
    title: 'DreamerV3',
    description: 'Reimplementation of DreamerV3, a state-of-the-art model-based RL algorithm.',
    year: 2024,
    image: '/images/projects/dreamer-v3.png',
  },
  {
    title: 'AlphaZero',
    description: 'A reimplementation of AlphaZero for Reversi and Connect Four.',
    year: 2023,
    image: '/images/projects/alphazero.png',
    href: 'https://github.com/Wung8/Reversi-and-Connect4-AI/tree/main',
  },
  {
    title: 'The Marshallow Test',
    description: 'Interactive website covering the marshmallow test and misconceptions.',
    year: 2026,
    image: '/images/projects/marshmallow-test.png',
  },
  {
    title: 'The Evolution of Trust',
    description: 'Visualization of the evolution of trust and multiple stable equilibria.',
    year: 2023,
    image: '/images/projects/evolution-of-trust.png',
  },
  {
    title: 'More Keyboard Shortcuts',
    description: 'Desktop app and code editor for creating custom keyboard shortcuts.',
    year: 2022,
    image: '/images/projects/more-keyboard-shortcuts.png',
    href: 'https://github.com/Wung8/More-Keyboard-Shortcuts',
  },
]

/*
 * Art section. Each piece is shown whole (never cropped) in rows of equal
 * height, and clicking one opens it full size. Pieces appear in this order;
 * reorder them to change how the rows come out. This order was picked so the
 * rows come out a similar height (the wide panoramas get a row each).
 *
 *   image  – path to the file in public/images/art/
 *   width, height – the image's size in pixels (right-click the file >
 *            Properties > Details on Windows). Used to lay out the rows before
 *            the images load, so the page doesn't jump around.
 *   alt    – short description of the piece, for screen readers
 *   title  – optional; shown under the piece when it's opened full size
 *
 * After adding or changing a piece, run `python scripts/make_art_thumbnails.py`
 * to make the small copy the grid shows.
 */
export const art = {
  heading: 'Art',
  pieces: [
    {
      image: '/images/art/sadler-center.jpg',
      width: 676,
      height: 976,
      alt: 'A campus building beneath a large cloudy sky',
    },
    {
      image: '/images/art/riverbend1.jpg',
      width: 658,
      height: 1176,
      alt: 'A girl sitting on sunlit rocks beside a river',
    },
    {
      image: '/images/art/study2.jpg',
      width: 1800,
      height: 1200,
      alt: 'Figure study of a woman sitting on the floor, leaning back with eyes closed',
    },
    {
      image: '/images/art/untitled4.jpg',
      width: 3546,
      height: 1182,
      alt: 'A figure on a mountain ridge in the rain, with glowing white plants',
    },
    {
      image: '/images/art/lightbulb.jpg',
      width: 2048,
      height: 1339,
      alt: 'A tiny figure climbing out of a giant broken light bulb in a beam of light',
    },
    {
      image: '/images/art/riverbend2.jpg',
      width: 1158,
      height: 2048,
      alt: 'A person paddling a green kayak on a river under a cloudy sky',
    },
    {
      image: '/images/art/beach.jpg',
      width: 1210,
      height: 2048,
      alt: 'A girl standing in the surf on an overcast beach, seen from behind',
    },
    {
      image: '/images/art/untitled1.jpg',
      width: 2991,
      height: 1402,
      alt: 'A girl on a bed with an oxygen mask in a bedroom overgrown with vines',
    },
    {
      image: '/images/art/study1.jpg',
      width: 1000,
      height: 1468,
      alt: 'Portrait study of a woman with long brown hair',
    },
    {
      image: '/images/art/untitled3.jpg',
      width: 3546,
      height: 1182,
      alt: 'Two figures on a bench between towering ruins under a pale sky',
    },
    {
      image: '/images/art/untitled2.jpg',
      width: 2560,
      height: 1280,
      alt: 'A girl sitting on a wrecked car in a ruined city, with small robots bringing balloons and a cake',
    },
    {
      image: '/images/art/plaza.jpg',
      width: 2048,
      height: 2020,
      alt: 'Acrylic painting of a sunset sky over power lines and a parking lot',
    },
  ],
}
