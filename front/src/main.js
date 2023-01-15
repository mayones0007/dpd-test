import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import { router } from './router'

const app = createApp(App).use(store).use(router)
router.isReady().then(() => {
    app.mount('#app')
});

