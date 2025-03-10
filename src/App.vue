<script setup lang="ts">
import { ref } from 'vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import QueryEditor from '@/components/QueryEditor.vue'

const endpoint = ref('')
const query = ref('')
const results = ref([])

const worker = new Worker(new URL("./assets/queryWorker.ts", import.meta.url), {
  type: "module",
});

worker.onmessage = (event: MessageEvent) => {
  results.value.push(JSON.parse(event.data) as never);
};

const runQuery = () => {
  results.value = [];
  //TODO: const endpoints = endpoint.value.split(',').map(e => e.trim());
  const endpoints = endpoint.value;
  console.log('postMessage', {
    sources: endpoints,
    query: query.value,
  });
  worker.postMessage({
    sources: endpoints,
    query: query.value,
  });
}
</script>

<template>
  <main>
    <div class="container">
      <div class="float-right">
        <DarkModeToggle />
      </div>
      <h1 class="text-3xl mb-6">Timezoneless Time Literals In SPARQL Demo</h1>

      <input
        class="mb-4 w-full bg-white dark:bg-gray-900"
        type="url"
        v-model="endpoint"
        placeholder="SPARQL endpoint URL"
      />

      <QueryEditor v-model="query" />

      <button
        class="mb-4 w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-900 hover:bg-gray-200 hover:dark:bg-gray-800 active:bg-gray-300 active:dark:bg-gray-700"
        @click="runQuery"
      >
        Run query
      </button>

      <div class="w-full h-96 overflow-scroll border border-gray-300 rounded-md bg-white dark:bg-gray-900">
        <div v-if="!results.length" class="m-2 text-center text-sm">
          No results yet
        </div>
        <div v-if="results.length" class="m-2 text-center text-sm">
          {{ results.length }} results
        </div>
        <div v-for="result in results" :key="result" class="p-2 m-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700">
          <div v-for="(value, key) in result" :key="key">
            <p>?{{ key }}: {{ value }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
