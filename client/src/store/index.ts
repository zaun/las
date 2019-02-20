import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '../types/store';

import { document } from './document';
import { media } from './media';
import { session } from './session';
import { template } from './template';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    document,
    media,
    session,
    template,
  },
};

export default new Vuex.Store<RootState>(store);
