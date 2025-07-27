import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as dwv from 'dwv'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
