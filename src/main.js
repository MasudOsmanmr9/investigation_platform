import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Import the Vuex store
import 'bootstrap/dist/css/bootstrap.min.css';



const app = createApp(App);

app.use(router);
app.use(store); // Register the store
app.mount('#app');
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';