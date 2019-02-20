import axios from 'axios';
import Vue from 'vue';
import { ActionTree, Module, MutationTree } from 'vuex';
import { RootState, APIState } from '../types/store';

export const state: APIState = {
  server: process.env.VUE_APP_ROOT_API,
};

const namespaced: boolean = true;

export const actions: ActionTree<APIState, RootState> = {
  getUrl(context, data) {
    return new Promise((resolve, reject) => {
      axios.post(context.state.server + '/media', data).then((result) => {
        resolve(result.data);
      }).catch((err) => {
        reject(new Error(err));
      });
    });
  },

  post(context, data) {
    return new Promise((resolve, reject) => {
      console.log('Post: ' + data.url);
      axios.post(data.url, data.content).then((result) => {
        resolve(result.data);
      }).catch((err) => {
        reject(new Error(err));
      });
    });
  },
};

export const mutations: MutationTree<APIState> = {
};

export const media: Module<APIState, RootState> = {
  namespaced,
  state,
  actions,
  mutations,
};
