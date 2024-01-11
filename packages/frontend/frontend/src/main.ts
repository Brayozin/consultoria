import { createApp } from 'vue'
import App from './App.vue'
import "./style.css";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import router  from "./router.ts";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// import all primevue components automatically


dayjs.locale('pt-br');


const app = createApp(App);
const pinia = createPinia();



app.use(router);
app.use(pinia);
app.use(PrimeVue);

// route to Home page
  router.push('/');

app.config.globalProperties.$dayjs = dayjs // Add dayjs as a global property


app.mount('#app')
