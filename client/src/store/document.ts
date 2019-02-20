import axios from 'axios';
import Vue from 'vue';
import { ActionTree, Module, MutationTree } from 'vuex';
import { RootState, APIState } from '../types/store';

export const state: APIState = {
  server: process.env.VUE_APP_ROOT_API,
};

const namespaced: boolean = true;

export const actions: ActionTree<APIState, RootState> = {
  get(context, title) {
    return new Promise((resolve, reject) => {
      axios.get(`${context.state.server}/document/${title}`).then((result) => {
        resolve(result.data);
      }).catch((err) => {
        reject(new Error(err));
      });
    });
  },

  post(context, data) {
    return new Promise((resolve, reject) => {
      axios.post(`${context.state.server}/document/`, data).then((result) => {
        resolve(result.data);
      }).catch((err) => {
        reject(new Error(err));
      });
    });
  },

  put(context, data) {
    return new Promise((resolve, reject) => {
      axios.put(context.state.server + data.$href, data).then((result) => {
        resolve(result.data);
      }).catch((err) => {
        reject(new Error(err));
      });
    });
  },

  search(context, terms) {
    return new Promise((resolve, reject) => {
      axios.get(`${context.state.server}/search?q=${terms}`).then((result) => {
        resolve(result.data);
      }).catch((err) => {
        reject(new Error(err));
      });
    });
  },
};

export const mutations: MutationTree<APIState> = {
};

export const document: Module<APIState, RootState> = {
  namespaced,
  state,
  actions,
  mutations,
};
