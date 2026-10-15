export const statNames = {
  trust: 'Доверие',
  courage: 'Смелость',
  clues: 'Улики'
}

export function isValidStory(story) {
  if (!story?.nodes?.[story.start] || !story.initialState) return false
  return Object.values(story.nodes).every(scene =>
    typeof scene.text === 'string' &&
    (scene.ending || Array.isArray(scene.choices) && scene.choices.every(choice => story.nodes[choice.to]))
  )
}

export function createGame(story) {
  return { sceneId: story.start, stats: { ...story.initialState } }
}

export function restoreGame(saved, story) {
  if (!saved || !story.nodes[saved.sceneId]) return createGame(story)
  const stats = Object.fromEntries(Object.keys(story.initialState).map(key => [
    key, Number.isFinite(saved.stats?.[key]) ? saved.stats[key] : story.initialState[key]
  ]))
  return { sceneId: saved.sceneId, stats }
}

export function canChoose(choice, stats) {
  return Object.entries(choice.requires || {}).every(([key, value]) => stats[key] >= value)
}

export function choose(game, choice, story) {
  const currentChoices = story.nodes[game.sceneId]?.choices || []
  if (!currentChoices.includes(choice) || !canChoose(choice, game.stats)) return game

  const stats = { ...game.stats }
  for (const [key, value] of Object.entries(choice.effects || {})) {
    if (key in stats) stats[key] += value
  }
  return { sceneId: choice.to, stats }
}
