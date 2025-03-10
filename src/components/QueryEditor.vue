<script setup lang="ts">
import Yasqe from '@triply/yasqe'
import { onMounted } from 'vue'
import '@triply/yasqe/build/yasqe.min.css'

const model = defineModel();

onMounted(() => {
  if (!document.getElementById('yasqe')) {
    console.error('Yasqe element not found')
    return
  }
  const yasqe = new Yasqe(document.getElementById('yasqe')!, {
    showQueryButton: false,
    // @ts-expect-error Must be null to disable button, but types do not allow it.
    createShareableLink: null,
  })

  // Already set the model value to the initial value of the editor
  model.value = yasqe.getValue();

  yasqe.on('change', () => {
    model.value = yasqe.getValue();
  });
})
</script>

<template>
  <div id="yasqe" class="mb-4 w-full"></div>
</template>

<style scoped></style>
