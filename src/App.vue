<script setup>
import NovelScene from './components/NovelScene.vue'
import { useNovel } from './composables/useNovel'

const { story, game, scene, error, message, updateStory, choose, restart } = useNovel()
</script>

<template>
  <main class="app">
    <header>
      <h1>Последний свет</h1>
      <span>Визуальная новелла</span>
    </header>

    <p v-if="error" class="notice">{{ error }} <button @click="updateStory">Повторить</button></p>
    <p v-else-if="!scene">Загрузка сюжета…</p>
    <NovelScene
      v-else
      :scene="scene"
      :game="game"
      :version="story.version"
      :message="message"
      @choose="choose"
      @restart="restart"
      @update="updateStory"
    />
  </main>
</template>
