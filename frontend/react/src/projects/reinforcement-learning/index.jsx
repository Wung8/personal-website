/*
 * Write-up for the Reinforcement Learning Library, shown at /projects/reinforcement-learning.
 * The URL comes from this folder's name. See ../index.js for what each field does.
 */

import Code from '../../components/CodeBlock.jsx'
import PostClip from '../../components/PostClip.jsx'
import TrainingCurves from '../../components/TrainingCurves.jsx'

// Episode returns from training this library and SB3 PPO side by side (made by
// rl-training-package's run_all.py, binned by aggregate.py): per chart and library,
// [frames, median, worst seed, best seed] over 100 stretches of training.
import trainingCurves from './training-curves.json'
// The same, for the PPO ablation on Flappy Bird (1 env with 5-step returns,
// 1 env with GAE, then 8 envs with GAE). Binned with --per-env, so x is each
// environment's own step count: the 8-env runs took 8 frames per step.
import ablationCurves from './ablation-curves.json'

// 20 s gameplay clips of agents trained with this library.
import cartpoleClip from './clips/cartpole.mp4'
import lunarClip from './clips/lunar.mp4'
import carClip from './clips/car.mp4' // dashboard bar cropped off (its score readout overflows)
import flappyClip from './clips/flappy.mp4'
import platformerClip from './clips/platformer.mp4' // 40 s of play at 2x speed
import soccerClip from './clips/soccer.mp4'

// The two pretrained IPPO agents (trained_networks/left_slime_actor.pth and
// right_slime_actor.pth) playing RL/environments/slime_volleyball.py: 50 s of play
// sped up 2.5x into a 20 s clip at 45 fps, with two points scored.
import heroVideo from './hero.mp4'
import heroPoster from './hero-poster.jpg'

// Code, copied straight out of the library (github.com/Wung8/Reinforcement-Learning).
// `?raw` imports the file's text, so editing a .py file here updates the page.
import ppoLoss from './code/ppo-loss.py?raw'
import gae from './code/gae.py?raw'
import envWorker from './code/env-worker.py?raw'
import initWeights from './code/init-weights.py?raw'

export default {
  title: 'Reinforcement Learning Library',
  subtitle: 'RL library implementing PPO and its implementation details from PyTorch',
  tags: ['PyTorch', 'NumPy', 'PPO', 'LSTM', 'Multiprocessing', 'Gymnasium'],
  links: [{ label: 'Github', href: 'https://github.com/Wung8/Reinforcement-Learning' }],
  hero: {
    video: heroVideo,
    // The video's own first frame, so nothing visibly changes when it starts playing.
    src: heroPoster,
    alt: 'Two slimes, one orange and one blue, rallying a ball back and forth over a net',
    aspectRatio: '2',
    caption: 'Two agents trained with IPPO playing Slime Volleyball against each other.',
  },
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      body: (
        <>
          <p>
            Reinforcement learning (RL) is a branch of machine learning where an agent learns to make
            decisions from its own experience rather than human-labeled data. Unlike supervised learning,
            where the model is told the correct output for a given input, reinforcement learning
            requires the agent actively try different actions to learn what maximizes its long-term reward.
          </p>
          <p>
            This library implements PPO (Proximal Policy Optimization) and its variants, rollout buffers, and vectorized environments from PyTorch and NumPy. Most of the
            design is based on the Stable Baselines 3 library. <a target="_blank" rel="noreferrer" href="https://github.com/dlr-rm/stable-baselines3">Link</a>
          </p>
        </>
      ),
    },
    {
      id: 'ppo',
      title: 'PPO',
      body: (
        <>
          <p>
            This section assumes some familiarity with reinforcement learning. If you are interested,
            check out these resources that helped me when I was learning.
          </p>
          <ul>
            <li><a target="_blank" rel="noreferrer" href="https://huggingface.co/learn/deep-rl-course/en/unit1/introduction">Introduction to Reinforcement Learning</a></li>
            <li><a target="_blank" rel="noreferrer" href="https://medium.com/data-science/an-intuitive-explanation-of-policy-gradient-part-1-reinforce-aa4392cbfd3c">Policy Gradient</a></li>
            <li><a target="_blank" rel="noreferrer" href="https://huggingface.co/learn/deep-rl-course/en/unit6/introduction">Actor Critic</a></li>
            <li><a target="_blank" rel="noreferrer" href="https://huggingface.co/blog/deep-rl-ppo">PPO</a></li>
          </ul>
          <p>
            PPO is a policy-gradient method built on top of REINFORCE, and uses two networks: 
            an actor, which outputs a probability for each action,
            and a critic, which estimates how much reward the agent will get from the current state.
            By using the critic as a baseline, PPO reduces the high variance of REINFORCE, 
            leading to more stable policy updates.
          </p>
          <p>
            What distinguishes PPO from other actor-critic methods is its efficient use of data. Instead of throwing away
            each batch after one update, it can train on the same batch for several epochs. This is normally unsafe, since each
            updates moves the policy further from the one that collected the data, leading to inaccurate updates.
          </p>
          <p>
            PPO prevents this by clipping the objective. Once the ratio between the new and old probability of an action moves 
            far away from 1, any samples that would result in further deviation stops contributing any gradient, so the policy 
            can't drift too far even with several updates.
          </p>
          <p>
            TRPO enforces a similar limit but requires a more computationally expensive optimization.
          </p>
        </>
      ),
    },
    {
      id: 'implementation-details',
      title: 'Implementation Details',
      body: (
        <>
          <p>
            The original PPO paper and its base implementation leaves out several implementation details,
            many of which contribute very significantly to its performance. Here I will go over a few
            details I've found to be important. More details can be found in The 37 Implementation Details of 
            PPO. <a target="_blank" rel="noreferrer" href="https://iclr-blog-track.github.io/2022/03/25/ppo-implementation-details/">Link</a>
          </p>
          <TrainingCurves
            series={[
              { key: 'nstep', label: 'Base: 5-step returns', slot: 4, endLabel: '5-step' },
              { key: 'gae1', label: 'GAE Lambda', slot: 3, endLabel: 'GAE' },
              { key: 'mine', label: 'Vec env + GAE', slot: 1, endLabel: '8 envs' },
            ]}
            charts={ablationCurves.charts.map((c) => ({ ...c, yLabel: 'Episode return', xLabel: 'Steps per environment' }))}
            note="Median episode return on Flappy Bird across 3 seeds, with the shaded band spanning the worst and best seed. +1 for getting through a pipe, +0.01 per frame survived, capped at around 300 score per episode."
          />

          <h3>Generalized Advantage Estimation</h3>
          <p>
            The advantage is how much better an action was than the critic expected. 
            Measuring the quality of an action with only the next reward is low variance but short-sighted.
            Using the rewards from the entire rest of the episode is unbiased but highly variable.
            GAE blends between then two with the lambda hyperparameter.
          </p>

          <h3>Vectorized Environments</h3>
          <p>
            Reinforcement learning requires a large and diverse set of experiences to make reliable updates. 
            Vectorized environments has the agent collect experience from several copies of the environment at once.
            This makes better use of available compute and makes each batch more diverse, since each copy of the environment
            follows its own trajectory and the agent isn't learning from one long stretch of closely related steps.
          </p>

          <h3>Hyperparameters</h3>
          <p>
            Generally I used similar hyperparameters as suggested in the 37 Implementation Details blog. 
            The learning rate of the critic should be around 3x higher than of the policy network, and generally
            the discount rate and lambda hyperparameters can be kept high across environments and are increased for
            very long-term focused ones.
          </p>
          <p>
            I found using a larger batch size and fewer epochs resulted in more stable learning in complex, highly variable environments,
            especially multi-agent ones.
          </p>
        </>
      ),
    },
    {
      id: 'stable-baselines-3-comparison',
      title: 'Stable Baselines 3 Comparison',
      body: (
        <>
          <p>
            I tested my implementation against Stable Baselines 3 (SB3), a trusted reinforcement learning library.
            I trained PPO using the default hyperparameters of each library on the same Gymnasium environments.
            My implementation reached SB3's peak performance with comparable learning performance, while having a faster runtime.
          </p>
          <TrainingCurves
            series={[
              { key: 'mine', label: 'This library' },
              { key: 'sb3', label: 'SB3 PPO' },
            ]}
            charts={trainingCurves.charts.map((c) => ({ ...c, yLabel: 'Episode return' }))}
            note="Median episode return across seeds (3 for CartPole and Lunar Lander, 2 for Car Racing), with the shaded band spanning the worst and best seed."
          />
        </>
      ),
    },
    {
      id: 'gallery',
      title: 'Gallery',
      body: (
        <>
          <h3>Gymnasium</h3>
          <div className="post-clips">
            <PostClip
              src={cartpoleClip}
              alt="A cart sliding left and right to keep a pole balanced upright"
              caption="CartPole."
            />
            <PostClip
              src={lunarClip}
              alt="A lander firing its engines to touch down gently between two flags"
              caption="Lunar Lander."
            />
          </div>
          <PostClip
            src={carClip}
            alt="A race car driving smoothly around the curves of a track, seen from above"
            caption="Car Racing."
          />
          <h3>Custom</h3>
          <div className="post-clips">
            <PostClip
              src={flappyClip}
              alt="A bird flapping through a series of gaps between pipes"
              caption="Flappy Bird environment used in early testing."
            />
            <PostClip
              src={soccerClip}
              alt="Two teams of agents pushing a ball around a field toward each other's goals"
              caption="Soccer 2v2 trained with IPPO."
            />
          </div>
          <PostClip
            src={platformerClip}
            alt="A small square jumping across platforms through a series of levels"
            caption="Custom platformer with pixel-based observations."
          />
        </>
      ),
    },
  ],
}
