<script setup lang="ts">
import { ref } from 'vue';
import DarkModeToggle from '@/components/DarkModeToggle.vue';
import QueryEditor from '@/components/QueryEditor.vue';
import queries from '@/assets/queries.json';

const endpoint = ref('');
const query = ref('');
const results = ref([]);
const querying = ref(false);
const componentKey = ref(0);

const active = ref({
    query: '',
    variation: '',
});

let worker: Worker | undefined;

const runQuery = () => {
    results.value = [];
    querying.value = true;
    //TODO: const endpoints = endpoint.value.split(',').map(e => e.trim());
    const endpoints = endpoint.value;
    console.log('postMessage', {
        sources: endpoints,
        query: query.value,
    });
    worker?.terminate();
    worker = new Worker(new URL('./assets/queryWorker.ts', import.meta.url), {
        type: 'module',
    });
    worker.onmessage = (event: MessageEvent) => {
        if (event.data === 'done') {
            querying.value = false;
            return;
        }
        results.value.push(JSON.parse(event.data) as never);
    };
    worker.postMessage({
        sources: endpoints,
        query: query.value,
    });
};

const stopQuery = () => {
    worker?.terminate();
    querying.value = false;
};

const loadVariation = (queryId: string) => {
    const queryData = queries.find(q => q.id === queryId);
    if (queryData) {
        if (active.value.query !== queryId) {
            // If another query is active, make the first variation of this query active
            active.value.query = queryData.id;
            active.value.variation = queryData.variations[0]?.id || '';
            query.value = queryData.variations[0]?.query || '';
            endpoint.value = queryData.variations[0]?.endpoint || '';
            componentKey.value += 1; // Force re-render of QueryEditor to fix content becoming visually misaligned
        } else {
            const currentVariation = queryData.variations.find(v => v.id === active.value.variation);
            const nextVariation = queryData.variations.find(v => v.id === currentVariation?.next);
            active.value.variation = nextVariation?.id || '';
            query.value = nextVariation?.query || '';
            endpoint.value = nextVariation?.endpoint || '';
            componentKey.value += 1; // Force re-render of QueryEditor to fix content becoming visually misaligned
        }
    }
};
</script>

<template>
    <main>
        <div class="container">
            <div class="float-right">
                <DarkModeToggle />
            </div>
            <h1 class="text-3xl mb-12">Timezoneless Time Literals In SPARQL Demo</h1>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <button v-for="query in queries" :key="query.id" @click="loadVariation(query.id)" :class="[active.query === query.id ? query.variations.find(v => v.id === active.variation)?.border : 'border-gray-300', 'mb-4 p-2 border rounded-md bg-white dark:bg-gray-900 hover:bg-gray-200 hover:dark:bg-gray-800 active:bg-gray-300 active:dark:bg-gray-700 disabled:opacity-50']">
                    {{ query.name }}
                </button>
            </div>

            <input
                class="mb-4 w-full bg-white dark:bg-gray-900"
                type="url"
                v-model="endpoint"
                placeholder="SPARQL endpoint URL"
            />

            <QueryEditor v-model="query" :key="componentKey" />

            <button
                class="mb-4 w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-900 hover:bg-gray-200 hover:dark:bg-gray-800 active:bg-gray-300 active:dark:bg-gray-700 disabled:opacity-50"
                @click="runQuery"
                v-if="!querying"
            >
                Run query
            </button>
            <button
                class="mb-4 w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-900 hover:bg-gray-200 hover:dark:bg-gray-800 active:bg-gray-300 active:dark:bg-gray-700 disabled:opacity-50"
                @click="stopQuery"
                v-else
            >
                Stop query
            </button>

            <div class="w-full h-96 overflow-scroll border border-gray-300 rounded-md bg-white dark:bg-gray-900">
                <div v-if="querying" class="m-2 text-center text-sm">Already found {{ results.length }} results...</div>
                <div v-else class="m-2 text-center text-sm">Found {{ results.length }} results.</div>
                <div
                    v-for="result in results"
                    :key="result"
                    class="p-2 m-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700"
                >
                    <div v-for="(value, key) in result" :key="key">
                        <p>?{{ key }}: {{ value }}</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped></style>
