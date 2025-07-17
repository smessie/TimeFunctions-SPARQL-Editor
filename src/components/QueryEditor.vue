<script setup lang="ts">
import Yasqe from '@triply/yasqe';
import { onMounted, ref } from 'vue';
import '@triply/yasqe/build/yasqe.min.css';

const model = defineModel();

const yasqeRef = ref<Yasqe | null>(null);

onMounted(() => {
    const el = document.getElementById('yasqe');
    if (!el) {
        console.error('Yasqe element not found');
        return;
    }

    const yasqe = new Yasqe(el, {
        showQueryButton: false,
        // @ts-expect-error Must be null to disable button, but types do not allow it.
        createShareableLink: null,
    });

    yasqeRef.value = yasqe;

    // Set initial value
    yasqe.setValue(model.value || '');

    // Update model when the editor changes
    yasqe.on('change', () => {
        model.value = yasqe.getValue();
    });
});

// Watch for changes from parent and update Yasqe editor
// This is no longer needed because of the force re-render fix in the parent component
/*watch(model, (newVal) => {
    const yasqe = yasqeRef.value;
    if (yasqe && newVal !== yasqe.getValue()) {
        yasqe.setValue(newVal || '');
    }
});*/
</script>

<template>
    <div id="yasqe" class="mb-4 w-full"></div>
</template>

<style scoped></style>
