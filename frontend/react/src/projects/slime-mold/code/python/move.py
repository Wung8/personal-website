def generateAgents(n_agents, gridsize):
    agents = []
    for i in range(n_agents):
        x, y = random.random() * gridsize, random.random() * gridsize
        d = random.random() * 2*math.pi
        agents.append([x, y, d])
    return agents

def moveAgents(agents, gridsize):
    for agent in agents:
        x, y, d = agent
        dx, dy = math.cos(d), math.sin(d)
        nx, ny = x + dx, y + dy
        
        if nx < 0 or nx > gridsize-1:
            nx = min(max(nx, 0), gridsize-1)
            d = random.random() * 2*math.pi
        if ny < 0 or ny > gridsize-1:
            ny = min(max(ny, 0), gridsize-1)
            d = random.random() * 2*math.pi
            
        agent[:] = nx, ny, d
