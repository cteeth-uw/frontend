<template>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <v-container class="mx-auto px-12">
      <!-- action buttons -->
      <v-btn-toggle v-model="selectedToolIndex" mandatory color="primary" divided>
        <v-btn
          v-for="tool in toolNames"
          :id="tool"
          :key="tool"
          :title="tool"
          :disabled="!dataLoaded || !canRunTool(tool)"
          :icon="getToolIcon(tool)"
          @click="onChangeTool(tool)"
          class="rounded-lg"
        />
      </v-btn-toggle>

      <v-btn
        class="rounded-lg"
        title="Reset"
        :disabled="!dataLoaded"
        icon="mdi-refresh"
        @click="onReset()"
      />

      <v-btn
        class="rounded-lg"
        title="Toggle Orientation"
        :disabled="!dataLoaded"
        icon="mdi-camera-switch"
        @click="toggleOrientation()"
      />
    </v-container>

    <div id="dwv" class="flex min-h-[400px] min-w-[400px] w-[100%]">
      <div id="layerGroup0" class="layerGroup"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { App, AppOptions, ViewConfig, ToolConfig, ViewLayer } from 'dwv'

// View options
const viewConfig0 = new ViewConfig('layerGroup0')
const viewConfigs = { '*': [viewConfig0] }
const options = new AppOptions(viewConfigs)

// Tool defs
const tools = {
  Scroll: new ToolConfig(),
  ZoomAndPan: new ToolConfig(),
  WindowLevel: new ToolConfig(),
  Draw: new ToolConfig(['Ruler']),
}
options.tools = tools
const toolNames = Object.keys(tools)
let selectedTool = 'Select Tool'
const selectedToolIndex = ref(0)

// The DWV app itself
let app: App | null = null

// State variables
let isFirstRender: boolean = false
let canScroll: boolean = false
let canWindowLevel: boolean = false
let nReceivedLoadError = 0
const dataLoaded = ref(false)
let orientation: 'axial' | 'coronal' | 'sagittal' | undefined = undefined

// Functions

// Reset the zoom and pan
const onReset = () => {
  app?.resetZoomPan()
}

// Switch to the next orientation
const toggleOrientation = () => {
  if (typeof orientation !== 'undefined') {
    if (orientation === 'axial') {
      orientation = 'coronal'
    } else if (orientation === 'coronal') {
      orientation = 'sagittal'
    } else if (orientation === 'sagittal') {
      orientation = 'axial'
    }
  } else {
    // default is most probably axial
    orientation = 'coronal'
  }
  // update data view config
  const viewConfig0 = new ViewConfig('layerGroup0')
  viewConfig0.orientation = orientation
  const viewConfigs = { '*': [viewConfig0] }
  app?.setDataViewConfigs(viewConfigs)
  // Re-render data
  const dataIds = app?.getDataIds()
  if (app && dataIds) {
    for (const dataId of dataIds) {
      app.render(dataId)
    }
  }
}

// Activate or deactivate a tool in the UI
const activateTool = (tool: string, flag: boolean) => {
  if (flag) {
    document.getElementById(tool)?.classList.add('active')
  } else {
    document.getElementById(tool)?.classList.remove('active')
  }
}

// Check if a tool can be run
const canRunTool = (tool: string) => {
  let res
  if (tool === 'Scroll') {
    res = canScroll
  } else if (tool === 'WindowLevel') {
    res = canWindowLevel
  } else {
    res = true
  }
  return res
}

// Get the icon for a tool
const getToolIcon = (tool: string) => {
  let res
  if (tool === 'Scroll') {
    res = 'mdi-menu'
  } else if (tool === 'ZoomAndPan') {
    res = 'mdi-magnify'
  } else if (tool === 'WindowLevel') {
    res = 'mdi-contrast'
  } else if (tool === 'Draw') {
    res = 'mdi-ruler'
  }
  return res
}

// Handle shape changes for the Draw tool
const onChangeShape = (shape: string) => {
  if (app && selectedTool === 'Draw') {
    app.setToolFeatures({ shapeName: shape })
  }
}

// Change the active tool
const onChangeTool = (tool: string) => {
  selectedTool = tool
  selectedToolIndex.value = toolNames.findIndex((element) => element === tool)
  for (const t of toolNames) {
    activateTool(t, false)
  }
  activateTool(tool, true)
  app?.setTool(tool)
  if (tool === 'Draw' && tools.Draw.options?.length) {
    onChangeShape(tools.Draw.options[0])
  } else {
    // if draw was created, active is now a draw layer...
    // reset to view layer
    const lg = app?.getActiveLayerGroup()
    lg?.setActiveLayer(0)
  }
}

// Handle the end of rendering
type DWVRenderEndEvent = Event & {
  dataid: string
}
const onRenderEnd = (event: DWVRenderEndEvent) => {
  if (isFirstRender) {
    isFirstRender = false
    const vl = app?.getViewLayersByDataId(event.dataid)[0]
    const vc = vl?.getViewController()
    // available tools
    if (vc?.canScroll()) {
      canScroll = true
    }
    if (vc?.isMonochrome()) {
      canWindowLevel = true
    }
    // selected tools
    let selectedTool = 'ZoomAndPan'
    if (canScroll) {
      selectedTool = 'Scroll'
    }
    onChangeTool(selectedTool)
  }
  const canvas = document.querySelector('#dwv canvas') as HTMLCanvasElement | null
  if (canvas) {
    canvas.style.height = '400px'
    canvas.style.width = '400px'
  }
}

// Handle the start of loading
const onLoadStart = () => {
  dataLoaded.value = false
  nReceivedLoadError = 0
  isFirstRender = true
}

// Handle the end of loading
const onLoadEnd = () => {
  if (nReceivedLoadError > 0) {
    console.error('There were errors loading the DICOM file.')
  } else {
    console.log('DICOM file loaded successfully.')
    // Set the initial slice to a specific slice, for example the middle slice
    const layers = app?.getViewLayers()
    if (layers) {
      const layer: ViewLayer = layers[0]
      const image = layer.getImageData()
      console.log('Image data:', image)
      // TODO: Set the initial slice to the middle slice
    }
  }
}

const onLoadError = (event: Event) => {
  console.error('Error loading DICOM file:', event)
  nReceivedLoadError++
}

onMounted(() => {
  // Create a new DWV app instance
  app = new App()
  app.init(options)
  app.addEventListener('renderend', onRenderEnd)
  app.addEventListener('loadend', onLoadEnd)
  app.addEventListener('loadstart', onLoadStart)
  app.addEventListener('loaderror', onLoadError)
  const dicomFileUrl = '/api/scans/scan1.zip'
  // const dicomFileUrl =
  //   'https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323851.dcm'
  app.loadURLs([dicomFileUrl])
})
</script>

<style scoped>
.layerGroup {
  flex: 1 1;
  margin: 5px 0;
  background-color: limeGreen;
  /* allow child centering */
  position: relative;
}
.layer {
  /* needed for overlay */
  position: absolute;
  /* center */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.vertical-slider {
  writing-mode: vertical-lr;
  direction: rtl;
  margin: 5px 5px 5px 0;
  width: 10px;
  -webkit-appearance: none;
}
/** slider vertical settings*/
input.vertical-slider[type='range']::-webkit-slider-runnable-track {
  width: 10px;
  cursor: pointer;
  background: lightgray;
  border: 0;
}
input.vertical-slider[type='range']::-webkit-slider-thumb {
  width: 10px;
  height: 15px;
  background: #2f3c4a;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: 0px;
  border: 0;
}
input.vertical-slider[type='range']:disabled::-webkit-slider-thumb {
  background: lightgray;
}
input.vertical-slider[type='range']:focus::-webkit-slider-runnable-track {
  background: lightgray;
}
input.vertical-slider[type='range']::-moz-range-track {
  width: 10px;
  cursor: pointer;
  background: lightgray;
  border: 0;
}
input.vertical-slider[type='range']::-moz-range-thumb {
  width: 10px;
  height: 15px;
  background: #2f3c4a;
  cursor: pointer;
  border: 0;
}
input.vertical-slider[type='range']:disabled::-moz-range-thumb {
  background: lightgray;
}

canvas {
  /* avoid parent auto-resize */
  vertical-align: middle;
}
/** tooltip */
.layerGroup span {
  display: none;
  background-color: palegreen;
  padding: 2px;
}
.layerGroup:hover span {
  display: inline-block;
  position: absolute;
  overflow: hidden;
}
/** crossshair */
.layerGroup hr {
  pointer-events: none;
  border: none;
  position: absolute;
  margin: 0;
}
hr.horizontal {
  border-top: 2px dashed lime;
}
hr.vertical {
  border-top: 2px dashed lime;
  transform-origin: left;
  transform: rotate(90deg);
}
#brushCursor {
  pointer-events: none;
  position: absolute;
  z-index: 100;

  width: 10px;
  height: 10px;
  border: 1px solid #fff;
  border-radius: 50%;
}
</style>
