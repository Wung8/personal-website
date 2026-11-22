def updateTrail(trailmap, diffusion_speed, evaporation_speed):
    H, W = len(trailmap), len(trailmap[0])
    old_trailmap = [[trailmap[y][x] for x in range(W)] for y in range(H)]

    for y in range(H):
        for x in range(W):
            # calculate blurred value
            total = 0
            for oy in (-1, 0, 1):
                for ox in (-1, 0, 1):
                    ny, nx = y + oy, x + ox
                    if 0 <= ny < H and 0 <= nx < W:
                        total += old_trailmap[ny][nx]
            blurred_value = total / 9

            # diffusion: blend with neighbors
            value = (1 - diffusion_speed) * old_trailmap[y][x] + diffusion_speed * blurred_value
            # evaporation: reduce to 0
            trailmap[y][x] = max(0, value - evaporation_speed)
