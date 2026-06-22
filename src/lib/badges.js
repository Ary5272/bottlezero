export const BADGES = [
  { key: 'first_drop', name: 'First Drop', description: 'Log your first bottle saved', icon: '💧', type: 'total', threshold: 1 },
  { key: 'hydrated', name: 'Hydrated', description: 'Save 10 bottles', icon: '🚰', type: 'total', threshold: 10 },
  { key: 'wave_maker', name: 'Wave Maker', description: 'Save 25 bottles', icon: '🌊', type: 'total', threshold: 25 },
  { key: 'ocean_guardian', name: 'Ocean Guardian', description: 'Save 50 bottles', icon: '🐋', type: 'total', threshold: 50 },
  { key: 'plastic_free', name: 'Plastic Free Hero', description: 'Save 100 bottles', icon: '🏆', type: 'total', threshold: 100 },
  { key: 'earth_champion', name: 'Earth Champion', description: 'Save 250 bottles', icon: '🌍', type: 'total', threshold: 250 },
  { key: 'legend', name: 'Legend', description: 'Save 500 bottles', icon: '⭐', type: 'total', threshold: 500 },

  { key: 'streak_3', name: 'On a Roll', description: '3-day streak', icon: '🔥', type: 'streak', threshold: 3 },
  { key: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '💪', type: 'streak', threshold: 7 },
  { key: 'streak_14', name: 'Unstoppable', description: '14-day streak', icon: '⚡', type: 'streak', threshold: 14 },
  { key: 'streak_30', name: 'Monthly Master', description: '30-day streak', icon: '👑', type: 'streak', threshold: 30 },

  { key: 'goal_1', name: 'Goal Getter', description: 'Hit your daily goal once', icon: '🎯', type: 'daily_goal', threshold: 1 },
  { key: 'goal_7', name: 'Consistent', description: 'Hit your daily goal 7 times', icon: '📅', type: 'daily_goal', threshold: 7 },
  { key: 'goal_30', name: 'Devoted', description: 'Hit your daily goal 30 times', icon: '🏅', type: 'daily_goal', threshold: 30 },
]

export function checkBadges(totalBottles, currentStreak, daysGoalMet) {
  return BADGES.map(badge => {
    let progress = 0
    if (badge.type === 'total') progress = totalBottles
    else if (badge.type === 'streak') progress = currentStreak
    else if (badge.type === 'daily_goal') progress = daysGoalMet

    return {
      ...badge,
      unlocked: progress >= badge.threshold,
      progress: Math.min(progress / badge.threshold, 1),
    }
  })
}
