/*
 * Write-up for RaidersAI, shown at /projects/raiders.
 * The URL comes from this folder's name. See ../index.js for what each field does.
 *
 * Clips were re-encoded from the raw recordings (max 480p, H.264 CRF 26) so several
 * can play at once without lagging the page.
 * Clips with sound keep it; the rest have their silent audio track dropped.
 * Clips shown side by side or in a grid had their black bars cropped off.
 */

import ImageGallery from '../../components/ImageGallery.jsx'
import PostClip from '../../components/PostClip.jsx'

// Pre-release
import earliestFootage from './clips/01-earliest-footage.mp4'
import earliestBotAi from './clips/02-earliest-bot-ai.mp4'
import earlyCombat from './clips/03-early-combat.mp4'
import coreCombat from './clips/04-core-combat.mp4'
import earlySprites from './clips/05-early-sprites.mp4'
import earlyAssets from './clips/06-early-assets.mp4'
import spikeCircle from './clips/07-spike-circle.mp4'
import spikeCircle2 from './clips/08-spike-circle-2.mp4'
import earlyDefense from './clips/09-early-defense.mp4'
import earlyDefense2 from './clips/10-early-defense-2.mp4'
import soundClip from './clips/11-sound.mp4'
import fragsClip from './clips/12-frags.mp4'
import spike1 from './images/spike-1.png'
import spike2 from './images/spike-2.png'
import spike3 from './images/spike-3.png'
import spike4 from './images/spike-4.png'
import spike5 from './images/spike-5.png'
import turret1 from './images/turret-1.png'
import turret2 from './images/turret-2.png'
import turret3 from './images/turret-3.png'

// Fall 2025
import joinAbuse from './clips/14-join-abuse.mp4'
import maxSpeed from './clips/16-max-speed.mp4'
import gymnasium from './clips/17-gymnasium.mp4'
import turretSpeed from './clips/18-turret-speed.mp4'
import speed100fps from './clips/18-100fps.mp4'
import siegeTurret1 from './clips/19-siege-turret-1.mp4'
import siegeTurret2 from './clips/19-siege-turret-2.mp4'
import siegeTurret3 from './clips/19-siege-turret-3.mp4'
import hitShake1 from './clips/20-hit-shake-1.mp4'
import hitShake2 from './clips/21-hit-shake-2.mp4'
import hitShake3 from './clips/22-hit-shake-3.mp4'
import hitAndRun from './clips/24-hit-and-run.mp4'
import botGaps from './clips/25-bot-gaps.mp4'
import earlyUiImage from './images/early-ui.png'
import leftHanded from './images/left-handed.png'
import storm1 from './images/storm.png'
import storm2 from './images/storm-2.png'
import trench1 from './images/trench-1.png'
import trench2 from './images/trench-2.png'
import trench3 from './images/trench-3.png'
import tournament from './images/tournament.png'
import rotation1 from './images/rotation-1.png'
import rotation2 from './images/rotation-2.png'
import botWipe from './images/bot-wipe.png'
import stoneWalls from './images/stone-walls-40v40.png'

/** A gameplay clip: full width, 16:9, with controls so it can be unmuted or scrubbed. */
function Clip({ src, alt, caption, aspectRatio = '16 / 9' }) {
  return <PostClip src={src} alt={alt} caption={caption} aspectRatio={aspectRatio} controls wide />
}

/** Several clips or images that share one caption. */
function Group({ caption, children }) {
  return (
    <figure className="post-group">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

export default {
  title: 'RaidersAI',
  subtitle: 'Browser-based game for experimenting with algorithmic decision-making AI',
  tags: ['Python', 'Javascript', 'AWS', 'PyGame', 'Port Forwarding', 'Game Design'],
  hero: {
    src: '/images/projects/raidersai.png',
    alt: 'RaidersAI gameplay',
    aspectRatio: '16 / 9',
  },
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      body: (
        <>
          <p>
            RaidersAI was a browser-based game, featuring loadout customization, base building, and
            pvp combat. It was intended to be a testing ground for creating algorithmic AI that could
            handle micro and macro level decision making, team coordination, and prioritizing
            objectives. The website is now down since my friends and I have moved on from it, and it
            costs about $15 a month to host.
          </p>
          <p>
            This will be a gallery documenting the development of this project and the incidents that
            occurred along the way.
          </p>
        </>
      ),
    },
    {
      id: 'pre-release',
      title: 'Pre-Release',
      body: (
        <>
          <p>
            When I started working on this project, I had the goal of building this game from pure
            Python and Pygame. I had created custom RL environments in the past, so this was my comfort
            zone. This meant I basically had to custom make a game engine, including physics and
            rendering.
          </p>
          <p>Over the next month, I would create the core gameplay and basic AI logic.</p>

          <Clip
            src={earliestFootage}
            alt="A small green map with a single player and a few resources"
            caption="9/18/25 The earliest footage I have of Raiders."
          />
          <Clip
            src={earliestBotAi}
            alt="Bots moving between trees and rocks around the edge of the map to collect resources"
            caption="10/9/25 The earliest bot scripts, a 3-state Finite Automata for collecting resources."
          />
          <Clip
            src={earlyCombat}
            alt="Orange and blue players fighting in the middle of the map"
            caption="10/12/25 Early combat."
          />
          <Clip
            src={coreCombat}
            alt="Bots fighting with resource counters in the corner"
            caption="10/12/25 Core combat features, with separate states for attacking, sieging, and retreating."
          />
          <Group caption="10/13/25 Early sprites.">
            <div className="post-clips">
              <PostClip src={earlySprites} alt="Early sprites for players, trees and rocks" aspectRatio="16 / 9" controls />
              <PostClip src={earlyAssets} alt="More early game assets in a fight" aspectRatio="16 / 9" controls />
            </div>
          </Group>
          <Group caption="10/13/25 Designing the spike sprite.">
            <ImageGallery
              pieces={[
                { image: spike1, width: 514, height: 541, alt: 'A bot labelled GATHERING next to a spike' },
                { image: spike2, width: 678, height: 657, alt: 'A bot labelled SEIGING next to spikes' },
                { image: spike3, width: 558, height: 442, alt: 'Spike sprites around a player' },
                { image: spike4, width: 765, height: 571, alt: 'A ring of spikes around a gathering bot' },
                { image: spike5, width: 621, height: 547, alt: 'Spikes next to a stone wall' },
              ]}
            />
          </Group>
          <Group caption="10/13/25 Designing the turret sprite.">
            <ImageGallery
              pieces={[
                { image: turret1, width: 466, height: 438, alt: 'Turret sprite next to a player' },
                { image: turret2, width: 673, height: 526, alt: 'Turret sprite with a player labelled RETREATING' },
                { image: turret3, width: 459, height: 496, alt: 'Turret sprite, final version' },
              ]}
            />
          </Group>
          <Group caption="10/14/25 The discovery of the spike-circle technique, later perfected.">
            <div className="post-clips">
              <PostClip src={spikeCircle} alt="A player surrounding an enemy with spikes" aspectRatio="16 / 9" controls />
              <PostClip src={spikeCircle2} alt="Another spike circle trapping a player" aspectRatio="16 / 9" controls />
            </div>
          </Group>
          <Group caption="10/15/25 Early base defense logic.">
            <div className="post-clips">
              <PostClip src={earlyDefense} alt="Bots defending their base from attackers" aspectRatio="16 / 9" controls />
              <PostClip src={earlyDefense2} alt="Bots defending a base surrounded by spikes" aspectRatio="16 / 9" controls />
            </div>
          </Group>
          <Group caption="10/29/25 Added sound.">
            <div className="post-clips">
              <PostClip src={soundClip} alt="Gameplay with sound effects" aspectRatio="16 / 9" controls />
              <PostClip src={fragsClip} alt="A frag grenade exploding, with sound" aspectRatio="16 / 9" controls />
            </div>
          </Group>
        </>
      ),
    },
    {
      id: 'fall-2025',
      title: 'Fall 2025',
      body: (
        <>
          <p>
            After some headache and learning port forwarding, I was able to play online with my
            friends. Once this was possible, we began designing AI for our bot teams. As I improved my
            bots, I also focused on improving the UI and adding new mechanics.
          </p>

          <Group caption="11/8/25 Early UI.">
            <ImageGallery
              pieces={[
                { image: earlyUiImage, width: 1585, height: 1599, alt: 'Close-up of the early HUD showing score and resources' },
              ]}
            />
          </Group>
          <Clip
            src={joinAbuse}
            alt="A huge cluster of spikes built by a player who joined late"
            caption="11/8/25 Players could join at any point in a game with starting loot, which someone of course abused."
          />

          <p>
            One of the largest reoccurring issues was performance, where framerate would drop below
            20fps. This was due to handling the game and rendering logic for hundreds of game objects.
            Don't make render-heavy games in Python.
          </p>

          <Group caption="11/21/25 For performance purposes, I flipped the display so +y was down and -y was up, resulting in the player being left-handed momentarily.">
            <ImageGallery
              pieces={[
                { image: leftHanded, width: 1176, height: 1131, alt: 'A player holding their weapon in their left hand' },
              ]}
            />
          </Group>
          <Group caption="11/21/25 Early storm rendering.">
            <ImageGallery
              pieces={[
                { image: storm1, width: 1189, height: 1186, alt: 'An orange storm closing in on the edge of the map' },
                { image: storm2, width: 1174, height: 1188, alt: 'The storm edge in the corner of the map' },
              ]}
            />
          </Group>
          <Clip
            src={maxSpeed}
            alt="A zoomed-out view of a whole match running quickly"
            caption="11/21/25 Showing off maximum game speed at a blistering 50fps."
          />
          <Clip
            src={gymnasium}
            alt="A match running as an RL environment"
            caption="11/21/25 I tried turning the game into a Gymnasium-style RL environment, but ended up scrapping the idea since the game ran way too slow."
          />
          <Group caption="11/23/25 I further sped up the game by reducing the amount of times each gameobject checked its surroundings. Previously the biggest slowdowns occurred when there were dozens of turrets in play.">
            <div className="post-clips">
              <PostClip src={turretSpeed} alt="A match with dozens of turrets running smoothly" controls />
              <PostClip src={speed100fps} alt="The game running at 100fps with the updated UI" controls />
            </div>
          </Group>

          <p>As I was working on this, I was also balancing the game as other people worked on the bots.</p>

          <Group caption="11/28/25 As I was developing the game, someone was working on trench warfare.">
            <ImageGallery
              pieces={[
                { image: trench1, width: 1002, height: 1040, alt: 'Two teams facing off across lines of spikes' },
                { image: trench2, width: 1002, height: 1040, alt: 'A close-up of a trench line' },
                { image: trench3, width: 1002, height: 1040, alt: 'A team dug in behind stone walls' },
              ]}
            />
          </Group>
          <Group caption="11/29/25 The trench warfare strategy completely dominated the first and only RaidersAI bot tournament.">
            <ImageGallery
              pieces={[
                { image: tournament, width: 1792, height: 816, alt: 'Tournament bracket won by MatthewAgent' },
              ]}
            />
          </Group>
          <Group caption="12/4/25 To balance against this strategy, I began designing siege turrets. I never was able to balance them, later replacing them with the scout turret.">
            <div className="post-clips post-clips--three">
              <PostClip src={siegeTurret1} alt="Siege turrets firing at a line of spikes" controls />
              <PostClip src={siegeTurret2} alt="Siege turrets breaking through a trench" controls />
              <PostClip src={siegeTurret3} alt="More siege turret testing" controls />
            </div>
          </Group>

          <p>
            As this was happening, I was also focused on improving the UI. This included HUD elements
            and effects for game feel.
          </p>

          <Group caption="12/14/25 Early hit animations.">
            <div className="post-clips post-clips--three">
              <PostClip src={hitShake1} alt="A player shaking when hit" controls />
              <PostClip src={hitShake2} alt="A structure shaking when hit" controls />
              <PostClip src={hitShake3} alt="Another hit animation test" controls />
            </div>
          </Group>

          <p>
            As I improved the visuals, it became a pain to constantly rework the server and client
            rendering scripts. This was when I learned the importance of separating the frontend and
            backend. I ended up creating a separate package that handled sending game data to the
            client and rendering, and the server was treated as a special client. This allowed me to
            make visual changes much faster.
          </p>

          <Group caption="12/18/25 Experimenting with rotation.">
            <ImageGallery
              pieces={[
                { image: rotation1, width: 810, height: 667, alt: 'A player and turrets drawn with rotation' },
                { image: rotation2, width: 748, height: 655, alt: 'Rotated turret sprites around a player' },
              ]}
            />
          </Group>

          <p>
            It was about this time when people got comfortable with creating bots for the game and
            began regularly posting updates.
          </p>

          <div className="post-clips">
            <Group caption="12/22/25 Bot team that had wiped out my bot team.">
              <ImageGallery
                pieces={[
                  { image: botWipe, width: 479, height: 430, alt: 'A bot team with kill counts over their names' },
                ]}
              />
            </Group>
            <Group caption="12/24/25 Another person found out stone walls were overtuned and dominated a 40v40.">
              <ImageGallery
                pieces={[
                  { image: stoneWalls, width: 1002, height: 1040, alt: 'A huge battle around stone walls in a 40v40' },
                ]}
              />
            </Group>
            <PostClip
              src={hitAndRun}
              alt="Bots raiding a base and pulling back"
              caption="12/26/25 I improved the sieging logic in my bots with a hit-and-run approach."
              controls
            />
            <PostClip
              src={botGaps}
              alt="A player fighting MatthewAgent8 up close"
              caption="12/29/25 Finding gaps in the bots AI."
              aspectRatio="366 / 306"
              controls
            />
          </div>

          <p>
            At this point, I decided to take a 2 week break from the project. When I came back, I found out that the tunneling service
            feature I relied on had been turned into a premium feature. After another 4 months, I decided to come back and try putting
            the game on the web.
          </p>
        </>
      ),
    },
  ],
}
