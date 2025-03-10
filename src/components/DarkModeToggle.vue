<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isOpen = ref(false)
const theme = ref(localStorage.theme || 'system')

const setTheme = (newTheme: string) => {
  console.log('setTheme', newTheme)
  theme.value = newTheme
  if (newTheme === 'system') {
    localStorage.removeItem('theme')
  } else {
    localStorage.theme = newTheme
  }
  isOpen.value = false
  updateTheme()
}

const updateTheme = () => {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && systemDark);
  document.documentElement.classList.toggle('dark', isDark);
};

onMounted(() => {
  updateTheme()
})
</script>

<template>
  <div class="relative inline-block text-left">
    <button @click="isOpen = !isOpen" class="p-2 bg-gray-200 dark:bg-gray-800 rounded-md">
      <span v-if="theme === 'light'">☀️</span>
      <span v-else-if="theme === 'dark'">🌙</span>
      <span v-else>⚙️</span>
    </button>
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-9999"
    >
      <button
        @click="setTheme('light')"
        class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
      >
        Light
      </button>
      <button
        @click="setTheme('dark')"
        class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
      >
        Dark
      </button>
      <button
        @click="setTheme('system')"
        class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
      >
        System
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
