def moveAgents(agents, gridsize):
    agents[:,0] += np.sin(agents[:,2])
    agents[:,1] += np.cos(agents[:,2])

    # agents that left the grid have their direction randomized and position clamped
    out = (agents[:,0] < 0) | (agents[:,0] > gridsize-1) | (agents[:,1] < 0) | (agents[:,1] > gridsize-1)
    agents[out, 2] = rng.random(out.sum()) * 2*math.pi
    agents[:,:2] = np.clip(agents[:,:2], 0, gridsize-1)
