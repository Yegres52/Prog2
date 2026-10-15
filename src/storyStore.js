import { isValidStory } from './game'

const SAVE_KEY = 'novel-save'

export async function fetchStory() {
  const url = new URL('story.json', document.baseURI)
  url.searchParams.set('t', Date.now())
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error('Не удалось загрузить сюжет')

  const story = await response.json()
  if (!isValidStory(story)) throw new Error('Неверный формат сюжета')
  return story
}

export function loadGame() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) } catch { return null }
}

export function saveGame(game) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(game)) } catch { /* Хранилище может быть недоступно. */ }
}
