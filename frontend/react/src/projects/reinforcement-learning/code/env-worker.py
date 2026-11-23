def env_worker(pipe, env):
    """
    Worker function to run the environment loop.
    
    :param pipe: The communication pipe (connection) to the main process.
    :param env: An environment instance.
    """
    env = env()
    while True:
        cmd, action = pipe.recv()
        if cmd == 'step':
            obs, reward, terminated, truncated, info = env.step(action)
            done = terminated | truncated
            try:
                if done:
                    obs, info = env.reset()
            except:
                pass
            pipe.send((obs, reward, done))
        elif cmd == 'reset':
            obs, info = env.reset()
            pipe.send(obs)
        elif cmd == 'get_expert_actions':
            action = env.get_expert_action()
            pipe.send(action)
        elif cmd == 'close':
            env.close()
            pipe.close()
            break
