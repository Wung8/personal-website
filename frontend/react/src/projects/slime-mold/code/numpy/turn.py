def turnAgents(agents, trailmap, turn_speed, sensor_distance, sensor_angle):
    # pad with zeros so sensors past the edge read 0 instead of going out of bounds
    pad = int(sensor_distance) + 1
    padded = np.pad(trailmap, pad)

    # one call senses for all agents
    def sense(angle_offset):
        angle = agents[:,2] + angle_offset
        sy = (agents[:,0] + np.sin(angle) * sensor_distance).astype(int)
        sx = (agents[:,1] + np.cos(angle) * sensor_distance).astype(int)
        return padded[sy + pad, sx + pad]

    forward = sense(0)
    left = sense(-sensor_angle)
    right = sense(sensor_angle)

    random_mask = (forward < left) & (forward < right)
    left_mask   = (left > forward) & (left > right)
    right_mask  = (right > forward) & (right > left)

    agents[random_mask, 2] += (rng.random(random_mask.sum()) - 0.5) * turn_speed
    agents[left_mask, 2]   -= rng.random(left_mask.sum()) * turn_speed
    agents[right_mask, 2]  += rng.random(right_mask.sum()) * turn_speed
