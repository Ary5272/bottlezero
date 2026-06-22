export const POINTS = {
  perBottle: 10,
  perBadge: 50,
  perGoalDay: 15,
}

export const LEVELS = [
  { name: 'Seedling', min: 0 },
  { name: 'Sprout', min: 250 },
  { name: 'Sapling', min: 700 },
  { name: 'Young Tree', min: 1500 },
  { name: 'Grove', min: 3000 },
  { name: 'Forest', min: 6000 },
  { name: 'Guardian', min: 12000 },
]

export const PERKS = [
  { level: 1, title: 'Welcome aboard', desc: 'Your impact journey starts here.' },
  { level: 2, title: 'Sprout badge frame', desc: 'A green ring around your profile.' },
  { level: 3, title: 'Custom daily goals', desc: 'Fine-tune your targets your way.' },
  { level: 4, title: 'Golden log button', desc: 'A shiny accent on your tracker.' },
  { level: 5, title: 'Grove leaderboard flair', desc: 'Stand out in friend challenges.' },
  { level: 6, title: 'Forest founder title', desc: 'A rare title shown to friends.' },
  { level: 7, title: 'Guardian status', desc: 'The highest honor on BottleZero.' },
]

export function calcPoints(totalBottles, unlockedBadges, daysGoalMet) {
  return (
    totalBottles * POINTS.perBottle +
    unlockedBadges * POINTS.perBadge +
    daysGoalMet * POINTS.perGoalDay
  )
}

export function getLevel(points) {
  let index = 0
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) index = i
  }
  const current = LEVELS[index]
  const next = LEVELS[index + 1] || null
  const progress = next
    ? (points - current.min) / (next.min - current.min)
    : 1
  const pointsToNext = next ? next.min - points : 0
  return {
    index,
    levelNumber: index + 1,
    name: current.name,
    current,
    next,
    progress: Math.max(0, Math.min(1, progress)),
    pointsToNext,
  }
}

export function getRewards(totalBottles, unlockedBadges, daysGoalMet) {
  const points = calcPoints(totalBottles, unlockedBadges, daysGoalMet)
  return { points, level: getLevel(points) }
}
