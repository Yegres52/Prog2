import { isValidStory } from './game'

const SAVE_KEY = 'novel-save'
const STORY_KEY = 'novel-story'

async function loadStoryFrom(url) {
  url.searchParams.set('t', Date.now())
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error('Не удалось загрузить сюжет')
  const story = await response.json()
  if (!isValidStory(story)) throw new Error('Неверный формат сюжета')
  return story
}

export async function fetchStory() {
  const remoteUrl = import.meta.env.VITE_STORY_URL
  if (remoteUrl) {
    try {
      const story = await loadStoryFrom(new URL(remoteUrl))
      try { localStorage.setItem(STORY_KEY, JSON.stringify(story)) } catch { /* Хранилище недоступно. */ }
      return story
    } catch {
      // Без сети продолжаем с последней загруженной версией сюжета.
      try {
        const cached = JSON.parse(localStorage.getItem(STORY_KEY))
        if (isValidStory(cached)) return cached
      } catch { /* Кеш ещё пуст или повреждён. */ }
    }
  }
  return loadStoryFrom(new URL('story.json', document.baseURI))
}

export function loadGame() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) } catch { return null }
}

export function saveGame(game) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(game)) } catch { /* Хранилище может быть недоступно. */ }
}
