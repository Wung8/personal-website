def turnAgents(agents, trailmap, turn_speed, sensor_distance, sensor_angle):
    H, W = len(trailmap), len(trailmap[0])
    
    def sense(agent, trailmap, angle_offset, sensor_distance):
        x, y, d = agent
        angle = d + angle_offset
        sx = int(x + math.cos(angle) * sensor_distance)
        sy = int(y + math.sin(angle) * sensor_distance)
        if 0 <= sy < H and 0 <= sx < W:
            return trailmap[sy][sx]
        return 0
        
    for agent in agents:
        kwargs = {
            "agent": agent,
            "trailmap": trailmap,
            "sensor_distance": sensor_distance,
        }
        forward = sense(**kwargs, angle_offset=0)
        left = sense(**kwargs, angle_offset=-sensor_angle)
        right = sense(**kwargs, angle_offset=sensor_angle)

        r = random.random()
        if forward > left and forward > right: pass # go forward
        elif forward < left and forward < right: agent[2] += (r - 0.5) * turn_speed # turn randomly
        elif left > right: agent[2] -= r * turn_speed # turn left
        elif right > left: agent[2] += r * turn_speed # turn right
