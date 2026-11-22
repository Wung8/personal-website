def leaveTrail(agents, trailmap):
    trailmap[agents[:,0].astype(int), agents[:,1].astype(int)] = 1
