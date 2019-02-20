import Vue from 'vue';
import App from './App.vue';
import store from './store';

import { router, vuetify } from './plugins/';
import './directives';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
