def updateTrail(trailmap, diffusion_speed, evaporation_speed):
    # 3x3 average of neighbors, zeros past the edge
    blurred = cv2.blur(trailmap, (3, 3), borderType=cv2.BORDER_CONSTANT)

    # diffusion: blend with neighbors
    value = (1 - diffusion_speed) * trailmap + diffusion_speed * blurred
    # evaporation: reduce to 0
    trailmap[:] = np.maximum(0, value - evaporation_speed)
