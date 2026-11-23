def compute_return_and_advantage(self, last_values, dones):
    last_values = last_values.clone().cpu().numpy().flatten()
    
    # GAE lambda        
    last_gae_lam = 0
    for step in reversed(range(self.buffer_size)):
        if step == self.buffer_size - 1:
            # if current episode is when episode ended, zero out state value estimate
            next_non_terminal = 1.0 - dones.astype(np.float32)
            next_values = last_values
        else:
            next_non_terminal = 1.0 - self.dones[step]
            next_values = self.values[step + 1]
        delta = self.rewards[step] + self.discount * next_values * next_non_terminal - self.values[step]
        last_gae_lam = delta + self.discount * self.gae_lambda * next_non_terminal * last_gae_lam
        self.advantages[step] = last_gae_lam

    # td lambda
    self.returns = self.advantages + self.values
