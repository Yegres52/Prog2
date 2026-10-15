import { computed, onMounted, onUnmounted, ref } from 'vue'
import { choose as applyChoice, createGame, restoreGame } from '../game'
import { fetchStory, loadGame, saveGame } from '../storyStore'

export function useNovel() {
  const story = ref(null)
  const game = ref(null)
  const error = ref('')
  const message = ref('')
  const scene = computed(() => story.value?.nodes[game.value?.sceneId])
  let timer
  let checking = false

  async function updateStory() {
    if (checking) return
    checking = true
    try {
      const nextStory = await fetchStory()
      const previousVersion = story.value?.version
      const saved = game.value || loadGame()
      const sceneWasRemoved = saved && !nextStory.nodes[saved.sceneId]

      story.value = nextStory
      game.value = restoreGame(saved, nextStory)
      saveGame(game.value)
      error.value = ''

      if (sceneWasRemoved) message.value = 'Сцена удалена из новой версии. Игра начата заново.'
      else if (previousVersion !== undefined && previousVersion !== nextStory.version) {
        message.value = 'Сюжет обновлён. Прогресс сохранён.'
      }
    } catch {
      if (!story.value) error.value = 'Не удалось загрузить story.json. Проверьте подключение.'
    } finally {
      checking = false
    }
  }

  function choose(choice) {
    game.value = applyChoice(game.value, choice, story.value)
    saveGame(game.value)
    message.value = ''
  }

  function restart() {
    game.value = createGame(story.value)
    saveGame(game.value)
    message.value = ''
  }

  onMounted(() => {
    updateStory()
    timer = setInterval(updateStory, 60000)
    window.addEventListener('focus', updateStory)
  })
  onUnmounted(() => {
    clearInterval(timer)
    window.removeEventListener('focus', updateStory)
  })

  return { story, game, scene, error, message, updateStory, choose, restart }
}
