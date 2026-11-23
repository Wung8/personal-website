/*
 * Write-up for the Reinforcement Learning Library, shown at /projects/reinforcement-learning.
 * The URL comes from this folder's name. See ../index.js for what each field does.
 */

import Code from '../../components/CodeBlock.jsx'

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
    src: '/images/projects/reinforcement-learning.png',
    alt: 'Two slimes and a ball in the Slime Volleyball environment',
    aspectRatio: '657 / 322',
  },
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      body: (
        <>
          <p>
            Reinforcement learning is a subfield (sort of) of machine learning where models learn
            from experience instead of human-labeled data. An agent takes actions in an
            environment, gets rewards, and slowly learns which actions lead to more reward.
          </p>
          <p>
            This library implements PPO (Proximal Policy Optimization), a recurrent LSTM version of
            PPO, IPPO for multi-agent games, and DAgger, all from PyTorch and NumPy. Most of the
            design is based on the Stable Baselines 3 library, and the goal was to understand every
            implementation detail by building it myself rather than calling it from a library.
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
            PPO is a policy gradient method. The agent has two networks: an actor, which outputs a
            probability for each action, and a critic, which estimates how much reward the agent
            will get from the current state.
          </p>
          <p>
            Training alternates between two phases. First the agent plays the game for a fixed
            number of steps and stores everything in a rollout buffer. Then it trains on that
            buffer for several epochs of minibatches, and throws the data away.
          </p>
          <p>
            The problem with reusing data for several epochs is that the policy can drift far from
            the one that collected it, and big policy updates tend to wreck training. PPO fixes this
            by clipping the ratio between the new and old action probabilities, so a single update
            can't push the policy too far.
          </p>
          <Code>{ppoLoss}</Code>
        </>
      ),
    },
    {
      id: 'implementation-details',
      title: 'Implementation Details',
      body: (
        <>
          <p>
            PPO on paper is fairly simple, but a lot of what makes it actually work is in the small
            details. These are the ones I implemented.
          </p>

          <h3>Generalized Advantage Estimation</h3>
          <p>
            The advantage is how much better an action was than the critic expected. Using only the
            next reward is low variance but biased, and using the whole rest of the episode is
            unbiased but noisy. GAE blends between the two with a parameter <code>λ</code>,
            computed in a single backwards pass over the buffer. When an episode ends, the next
            state's value is zeroed out so rewards don't leak between episodes.
          </p>
          <Code>{gae}</Code>

          <h3>Advantage Normalization</h3>
          <p>
            Advantages are normalized to zero mean and unit variance in each minibatch, so the size
            of the update doesn't depend on the scale of the environment's rewards.
          </p>

          <h3>Separate Actor and Critic</h3>
          <p>
            The actor and critic are separate networks with separate optimizers, with the critic
            using a larger learning rate. Both have their gradients clipped to a max norm of 0.5.
          </p>

          <h3>Orthogonal Initialization</h3>
          <p>
            Layers are initialized orthogonally, and the last layer of the actor is scaled down by
            100 so every action starts with roughly equal probability.
          </p>
          <Code>{initWeights}</Code>

          <h3>Multi-Discrete Actions</h3>
          <p>
            Some games need more than one action at a time, like moving and jumping at the same
            time. For these, the actor's output is split into one categorical distribution per
            action, and their log probabilities and entropies are summed.
          </p>

          <h3>Networks</h3>
          <p>
            The default network is picked from the observation shape: an MLP for vectors, and a CNN
            for images. Image observations are downscaled to 64×64 and normalized to [0, 1] with a
            wrapper, and Atari games use frame skipping.
          </p>
        </>
      ),
    },
    {
      id: 'vectorized-environments',
      title: 'Vectorized Environments',
      body: (
        <>
          <p>
            Most of the training time is spent playing the game, not training the network. To speed
            this up, the library runs many copies of the environment in parallel, each in its own
            process. The main process sends every worker an action through a pipe, and every worker
            steps its environment and sends back the result, resetting itself when its episode
            ends.
          </p>
          <Code>{envWorker}</Code>
          <p>
            The actor then picks actions for all environments in one batched forward pass. With 12
            environments, the agent collects 12 times as much data per step, and the data is more
            diverse since every copy is in a different situation.
          </p>
        </>
      ),
    },
    {
      id: 'recurrent-ppo',
      title: 'Recurrent PPO',
      body: (
        <>
          <p>
            Standard PPO only sees the current observation, so it fails on games where it needs to
            remember something, like CartPole with the velocities hidden or a T-maze where the
            correct turn is shown at the start. Recurrent PPO replaces the networks with LSTMs that
            carry a hidden state between steps.
          </p>
          <p>
            This complicates training, since minibatches can't be shuffled single steps anymore.
            Instead the buffer stores the LSTM's hidden states during the rollout and samples
            overlapping sequences of 16 steps (starting every 8 steps). Each sequence starts from
            its stored hidden state and is trained with truncated backpropagation through time,
            resetting the hidden state wherever an episode starts.
          </p>
        </>
      ),
    },
    {
      id: 'multi-agent',
      title: 'Multi-Agent',
      body: (
        <>
          <p>
            IPPO (Independent PPO) trains several agents in the same game, each with its own PPO
            learner and rollout buffer, treating the other agents as part of the environment. I
            used this to train agents against each other in Slime Volleyball and a 2v2 soccer game.
            Smaller numbers of epochs worked better here, since every agent is learning against
            opponents that keep changing.
          </p>
          <p>
            The library also has DAgger, an imitation learning method where the agent learns from an
            expert's actions on the states it visits itself.
          </p>
        </>
      ),
    },
    {
      id: 'environments',
      title: 'Environments',
      body: (
        <>
          <p>
            The library works with Gymnasium environments and with my own environments that follow
            the same interface. One set of hyperparameters is used for all of them, so it isn't
            tuned for any one game, but it's good enough to learn each one.
          </p>
          <ul>
            <li>
              <strong>Gymnasium:</strong> CartPole, Acrobot, LunarLander, CarRacing, Breakout and
              Space Invaders
            </li>
            <li>
              <strong>Custom:</strong> Flappy Bird (from state and from pixels), Slime Volleyball,
              Soccer, a Diep.io clone, a platformer, Geometry Dash, a T-maze and a simple memory task
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'additional-work',
      title: 'Additional Work',
      body: (
        <>
          <p>
            DAgger, PPO fine-tuning, and IPPO with LSTMs aren't working with the current version of
            the library. I left those to work on DreamerV3, a model-based RL algorithm.
          </p>
        </>
      ),
    },
  ],
}
