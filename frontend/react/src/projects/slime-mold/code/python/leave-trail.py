def leaveTrail(agents, trailmap):
    for (x, y, d) in agents:
        trailmap[int(y)][int(x)] = 1
