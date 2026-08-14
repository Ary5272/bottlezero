export const routeImporters = {
  '/map': () => import('../routes/Map'),
  '/insights': () => import('../routes/Insights'),
  '/rewards': () => import('../routes/Rewards'),
  '/challenges': () => import('../routes/Challenges'),
  '/learn': () => import('../routes/Learn'),
  '/profile': () => import('../routes/Profile'),
  '/about': () => import('../routes/About'),
  '/privacy': () => import('../routes/Privacy'),
  '/delete-account': () => import('../routes/DeleteAccount'),
  '/auth': () => import('../routes/Auth'),
}

export function prefetchRoute(path) {
  const load = routeImporters[path]
  if (load) load().catch(() => {})
}

export function prefetchAll() {
  for (const load of Object.values(routeImporters)) load().catch(() => {})
}
