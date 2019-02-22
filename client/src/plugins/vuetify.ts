import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/src/stylus/app.styl';
import '@mdi/font/css/materialdesignicons.css';

let vuetify = null;

if (Vuetify.version) {
  Vue.use(Vuetify, {
    iconfont: 'mdi',
  });
} else {
  Vue.use(Vuetify);

  vuetify = new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
  });
}

export default vuetify;
