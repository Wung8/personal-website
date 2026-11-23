def init_weights(model, gain='relu'):
    for layer in model:
        if isinstance(layer, (nn.Conv2d, nn.Linear)):
            nn.init.orthogonal_(layer.weight, gain=nn.init.calculate_gain(gain))
            if layer.bias is not None:
                nn.init.zeros_(layer.bias)
    for layer in reversed(model):
        if isinstance(layer, nn.Linear):
            with torch.no_grad():
                layer.weight.div_(100)
            break
