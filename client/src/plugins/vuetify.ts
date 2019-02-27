import Vue from 'vue';
import Vuetify from 'vuetify';
import { startsWith } from 'lodash';
import 'vuetify/src/stylus/app.styl';
import '@mdi/font/css/materialdesignicons.css';

let vuetify = null;

if (startsWith(Vuetify.version, '2.')) {
  Vue.use(Vuetify);

  vuetify = new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
  });
} else {
  Vue.use(Vuetify, {
    iconfont: 'mdi',
  });
}

export default vuetify;
