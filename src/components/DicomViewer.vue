<template>
  <div class="p-4">
    <form @submit.prevent="loadZipScan" class="mb-4">
      <label for="filename">Enter DICOM ZIP filename:</label>
      <input
        v-model="filename"
        type="text"
        id="filename"
        class="border px-2 py-1 mr-2"
        placeholder="e.g. CT_Head_001.zip"
      />
      <button type="submit" class="bg-blue-500 text-white px-3 py-1">Load</button>
    </form>

    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
    <div v-if="loading" class="text-gray-500">Loading scan...</div>

    <div
      id="dwv-container"
      style="width: 512px; height: 512px; margin-top: 1rem;"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as dwv from 'dwv'
import '@/assets/dwv/dwv.css'

export default defineComponent({
  name: 'DicomViewer',
  setup() {
    const filename = ref('')
    const error = ref('')
    const loading = ref(false)

    const loadZipScan = async () => {
      error.value = ''
      loading.value = true

      const url = `/api/scans/${filename.value}`
      window.console.log('a')

      try {
        window.console.log('b')
        console.log('[DWV] Starting load from:', url)

        const app = new (dwv as any).App()

        app.init({
          containerDivId: 'dwv-container',
          //tools: ['Scroll', 'ZoomAndPan', 'WindowLevel'],
          isMobile: false
        })

        app.addEventListener('load', () => {
          console.log('[DWV] Load complete')
          loading.value = false
        })

        app.addEventListener('load-error', (e: any) => {
          console.error('[DWV] Load error:', e)
          error.value = 'Failed to load the DICOM ZIP file.'
          loading.value = false
        })

        console.log('[DWV] Calling app.loadURLs()')
        app.loadURLs([url])
      } catch (err: any) {
        console.error('[DWV] Unexpected error:', err)
        error.value = `Error initializing DWV: ${err?.message || err}`
        loading.value = false
      }
    }

    return {
      filename,
      error,
      loading,
      loadZipScan
    }
  }
})
</script>
