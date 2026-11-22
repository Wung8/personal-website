/*
 * Write-up for the Slime Mold Simulation, shown at /projects/slime-mold.
 * The URL comes from this folder's name. See ../index.js for what each field does.
 */

import Code from '../../components/CodeBlock.jsx'
import ImageGallery from '../../components/ImageGallery.jsx'
import PostClip from '../../components/PostClip.jsx'
import heroVideo from './hero.mp4'

// Clips, rendered from the notebook (hoohacks/slimemold.ipynb) at its 20 fps.
import moveClip from './clips/algo-1-move.mp4'
import trailClip from './clips/algo-2-trail.mp4'
import diffuseClip from './clips/algo-3-diffuse.mp4'
import turnClip from './clips/algo-4-turn.mp4'
import scale300Clip from './clips/algo-5-300.mp4'
import scale1500Clip from './clips/algo-6-1500.mp4'
import numpy1500Clip from './clips/numpy-1500.mp4'
import numpy10000Clip from './clips/numpy-10000.mp4'

// Code, copied straight out of the notebook's cells. `?raw` imports the
// file's text, so editing a .py file here updates the page.
import pyMove from './code/python/move.py?raw'
import pyLeaveTrail from './code/python/leave-trail.py?raw'
import pyUpdateTrail from './code/python/update-trail.py?raw'
import pyTurn from './code/python/turn.py?raw'
import npMove from './code/numpy/move.py?raw'
import npLeaveTrail from './code/numpy/leave-trail.py?raw'
import npUpdateTrail from './code/numpy/update-trail.py?raw'
import npTurn from './code/numpy/turn.py?raw'

// Stills from the presets in hoohacks/config.yaml, run with `slimemold copy.py`.
import galleryWhiteLoop from './gallery/white-loop.jpg'
import galleryGold from './gallery/gold-20000.jpg'
import galleryBlue from './gallery/blue-two-species.jpg'
import galleryWhiteRing from './gallery/white-ring.jpg'
import galleryThreeSpecies from './gallery/three-species.jpg'
import galleryPinkBlue from './gallery/pink-blue-ring.jpg'

const gallery = [
  {
    image: galleryBlue,
    width: 1568,
    height: 960,
    alt: 'Two species of slime mold in blue and cyan bursting outward from the centre',
    title: 'Two species, 20,000 agents, after 300 frames',
  },
  {
    image: galleryThreeSpecies,
    width: 960,
    height: 960,
    alt: 'Three species in magenta, blue and cyan radiating out from a dark centre',
    title: 'Three species, 20,000 agents, after 300 frames',
  },
  {
    image: galleryPinkBlue,
    width: 960,
    height: 960,
    alt: 'Pink and blue trails forming an X shape with loops and dots',
    title: 'Two species, 50,000 agents spawned on a ring, after 300 frames',
  },
  {
    image: galleryGold,
    width: 1568,
    height: 960,
    alt: 'A gold network of looping trails spreading outward',
    title: '20,000 agents with high diffusion, after 1,000 frames',
  },
  {
    image: galleryWhiteRing,
    width: 960,
    height: 960,
    alt: 'White wiggly trails spreading across the whole grid',
    title: '10,000 agents spawned on a ring, after 600 frames',
  },
  {
    image: galleryWhiteLoop,
    width: 1182,
    height: 1120,
    alt: 'White trails forming a large loop with dense tangled clusters at the top and bottom',
  },
]

export default {
  title: 'Slime Mold Simulation',
  subtitle: 'Highly vectorized implementation of the Slime Mold simulation',
  tags: ['NumPy', 'Vectorization', 'Cellular Automata', 'PyGame'],
  links: [{ label: 'Github', href: 'https://github.com/Wung8/SlimeMoldSimulation' }],
  hero: {
    video: heroVideo,
    src: '/images/projects/slime-mold.png',
    alt: 'Slime mold simulation: glowing trails branching outward into a network',
    aspectRatio: '16 / 9',
    caption: 'Multi-species slime mold simulation of 20,000 agents running at 14fps.',
  },
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      body: (
        <>
          <p>
            The Slime Mold is a cellular automota, very similar to Conway's Game of Life, where
            thousands of individual cells follow a very simple set of rules to produce complex
            patterns. This project focuses on a basic configurable multi-species implementation
            of the Slime Mold and fully vectorizing it.
          </p>
        </>
      ),
    },
    {
      id: 'algorithm-overview',
      title: 'Algorithm Overview',
      body: (
        <>
          <p>The simulation has two parts: a population of agents and a trail map.</p>
          <p>
            Each agent has an initialized position and direction. Every frame, each agent
            moves forward by one unit. If an agent hits the edge, it turns to a random direction.
          </p>
          <Code>{pyMove}</Code>
          <PostClip
            src={moveClip}
            alt="White dots moving in straight lines across a black grid"
            caption="20 agents on a 50×50 grid"
          />
          <p>
            As the agent moves, it leaves behind a trail on the trailmap.
          </p>
          <Code>{pyLeaveTrail}</Code>
          <PostClip
            src={trailClip}
            alt="Agents drawing permanent white lines until the grid fills up"
            caption="Without evaporation, the trails never fade and the grid fills up"
          />
          <p>
            Every frame, the trail diffuses, or blurs, and evaporates.
          </p>
          <Code>{pyUpdateTrail}</Code>
          <PostClip
            src={diffuseClip}
            alt="Agents leaving soft trails that blur and fade behind them"
          />
          <p>
            Before moving, each agent checks the pixels in front of it, checking straight forward,
            slightly left, and slightly right. The agent then turns in a randomized amount towards
            the direction where the trail is strongest.
          </p>
          <Code>{pyTurn}</Code>
          <PostClip
            src={turnClip}
            alt="Agents curving toward each other's trails and forming branches"
          />
          <p>
            While this may not look very impressive right now, all we have to do is increase our
            grid size and the number of agents.
          </p>
          <div className="post-clips">
            <PostClip
              src={scale300Clip}
              alt="A web of trails forming across a 100 by 100 grid"
              caption="300 agents on a 100×100 grid"
            />
            <PostClip
              src={scale1500Clip}
              alt="A fine network of trails forming across a 250 by 250 grid"
              caption="1,500 agents on a 250×250 grid"
            />
          </div>
        </>
      ),
    },
    {
      id: 'vectorization',
      title: 'Vectorization',
      body: (
        <>
          <p>
            Currently, every updat is being done in Python, with a time complexity 
            of <code>O(N) + O(M^2)</code>, with <code>N</code> being the number of agents 
            and <code>M</code> being the size of the grid. 
            Our tiny simulation with 1,500 agents on a 250x250 grid is already under 15 fps.
          </p>
          <p>
            Python is a very slow language, and not very good with this kind of dense computation.
            It would be great if we could use Python to only call high-level functions, and 
            use a much faster language like C to do the heavier computation. This process
            exists, and is called Vectorization.
          </p>
          <p>
            Vectorization is the process of representing all our agents with vectors, and making all the 
            updates simultaneously using matrix operations.
          </p>
        </>
      ),
    },
    {
      id: 'numpy',
      title: 'Numpy',
      body: (
        <>
          <p>
            Every agent can be represented with a single <code>(N, 3)</code> Numpy array
            of <code>[y, x, angle]</code>, and the trail map is an <code>(H, W)</code> array.
            Every rule above can be turned into a few vectorized operations.
          </p>

          <p>
            I won't be going over every reimplementation, but just to show some interesting ones:
          </p>

          <h3>Movement</h3>
          <p>
            Movement can be handled with simple vector addition. We can then mask out all the
            agents that are out of bounds and handle that case independently of the others.
          </p>
          <Code>{npMove}</Code>

          <h3>Trails</h3>
          <p>
            Numpy allows for some fancy indexing, so we can directly update indexed values
            in the trailmap rather than looping over the agents.
          </p>
          <Code>{npLeaveTrail}</Code>

          <h3>Blurring</h3>
          <p>
            The library <code>OpenCV</code> already implements blurring, but if you want to know
            the details of how it works you can look up Convolutions.
          </p>
          <Code>{npUpdateTrail}</Code>

          <h3>Sensing</h3>
          <p>
            For sensing and turning, we can create a mask, one for agents that had a stronger left
            sensor, another for a stronger right sensor, and a third for going straight. We can apply
            the angle updates to the masked-out agents with array indexing.
          </p>
          <Code>{npTurn}</Code>

          <p>
            Now our simulation runs at a clean 500 fps, and we can easily handle
            10,000 agents with a gridsize of 800 at around 40 fps. I also made the agents spawn in a
            circle because it looks nicer.
          </p>
          <div className="post-clips">
            <PostClip
              src={numpy1500Clip}
              alt="Agents spawned in a circle spreading outward into a network on a 250 by 250 grid"
              caption="1,500 agents on a 250×250 grid"
            />
            <PostClip
              src={numpy10000Clip}
              alt="A dense circle of agents forming a fine web and sending out tendrils on an 800 by 800 grid"
              caption="10,000 agents on an 800×800 grid"
            />
          </div>
        </>
      ),
    },
    {
      id: 'additional-work',
      title: 'Additional Work',
      body: (
        <>
          <h3>Species</h3>
          <p>
            Species were handled as individual channels, and during sensing trails left by other species
            had a negative weight.
          </p>

          <h3>GPU Acceleration</h3>
          <p>
            This project only uses the CPU for computation, I'm sure if you used GPU to accelerate
            the code you could achieve at least a 20x speedup.
          </p>

          <h3>Additional Configs</h3>
          <p>
            For this project I created several preset configurations in <code>config.yaml</code>
            that you can change in the window with the arrow keys.
          </p>
        </>
      ),
    },
    {
      id: 'gallery',
      title: 'Gallery',
      body: <ImageGallery pieces={gallery} />,
    },
  ],
}
