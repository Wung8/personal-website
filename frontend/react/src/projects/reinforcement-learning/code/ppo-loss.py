# normalize advantages
advantages = rollout_data.advantages
if self.normalize_advantage:
    advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)

# ratio between old and new policy, should be one at the first iteration
ratio = torch.exp(log_prob - rollout_data.log_probs)

# clipped loss
policy_loss_1 = advantages * ratio
policy_loss_2 = advantages * torch.clamp(ratio, 1-clip_range, 1+clip_range)
policy_loss = -torch.mean(torch.min(policy_loss_1, policy_loss_2))
