<script setup>
import { canChoose, statNames } from '../game'

defineProps({
  scene: { type: Object, required: true },
  game: { type: Object, required: true },
  version: { type: [Number, String], required: true },
  message: { type: String, default: '' }
})

defineEmits(['choose', 'restart', 'update'])

function requirement(choice) {
  return Object.entries(choice.requires || {})
    .map(([key, value]) => `${statNames[key]} ${value}`)
    .join(', ')
}
</script>

<template>
  <div class="art" :class="scene.ending ? 'ending' : ''" role="img" :aria-label="scene.title">
    <span>{{ scene.image }}</span>
  </div>
  <section class="content">
    <p v-if="message" class="notice">{{ message }}</p>
    <div class="stats">
      <span v-for="(value, key) in game.stats" :key="key">{{ statNames[key] }}: <b>{{ value }}</b></span>
    </div>
    <h2>{{ scene.title }}</h2>
    <p class="story-text">{{ scene.text }}</p>

    <div v-if="scene.choices" class="choices">
      <button v-for="choice in scene.choices" :key="choice.to + choice.text" :disabled="!canChoose(choice, game.stats)" @click="$emit('choose', choice)">
        {{ choice.text }}
        <small v-if="!canChoose(choice, game.stats)">Нужно: {{ requirement(choice) }}</small>
      </button>
    </div>
    <button v-else class="restart" @click="$emit('restart')">Начать заново</button>
    <footer><span>Версия сюжета: {{ version }}</span><button @click="$emit('update')">Проверить обновление</button></footer>
  </section>
</template>
