import { createApp } from 'vue'
import App from "./app.vue"
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    icons:{
        defaultSet: 'mdi',
        aliases,
        sets:{
            mdi,
        }
    },
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    }
})
createApp(App).use(vuetify).use(router).mount('#app')
