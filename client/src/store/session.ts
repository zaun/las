import axios from 'axios';
import Vue from 'vue';
import { cloneDeep, findIndex, isEqual, map } from 'lodash';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState, SessionState } from '../types/store';
import { SessionViewEnum } from '../types/enums';
import router from '../plugins/router';

export const state: SessionState = {
  mode: SessionViewEnum.VIEW,
  busy: false,
  user: null,
  templates: null,
  originalDocument: null,
  document: null,
  originalTemplate: null,
  template: null,
  searchResults: null,

  themeColor: 'teal',
};

const namespaced: boolean = true;

export const actions: ActionTree<SessionState, RootState> = {
  cancelEdit(context) {
    context.commit('cancelEdit');
    context.commit('setEditMode', false);
    return Promise.resolve();
  },

  loadDocument(context, title) {
    context.commit('setBusy', true);
    context.commit('setDocument', null);

    return context.dispatch('document/get', title, { root: true }).then((doc) => {
      context.commit('setDocument', doc);
      return context.dispatch('loadTemplate', doc.template);
    }).catch(() => {
      context.commit('setDocument', null);
      return false;
    }).finally(() => {
      context.commit('setBusy', false);
    });
  },

  loadTemplate(context, name) {
    context.commit('setBusy', true);
    context.commit('setTemplate', null);

    return context.dispatch('template/get', name, { root: true }).then((doc) => {
      context.commit('setTemplate', doc);
      return true;
    }).catch(() => {
      context.commit('setTemplate', null);
      return false;
    }).finally(() => {
      context.commit('setBusy', false);
    });
  },

  saveDocument(context) {
    if (context.state.document === null) {
      return Promise.reject();
    }

    context.commit('setBusy', true);
    return context.dispatch('document/put', context.state.document, { root: true }).then((doc) => {
      let newUrl = false;
      if (context.state.document.title !== context.state.originalDocument.title) {
        newUrl = true;
      }
      context.commit('setDocument', doc);
      context.commit('setEditMode', false);

      if (newUrl) {
        router.push({ name: 'document', params: { title: context.state.document.title }});
      }
    }).finally(() => {
      context.commit('setBusy', false);
    });
  },

  saveTemplate(context) {
    context.commit('setBusy', true);
    const template = cloneDeep(context.state.template);
    if (template.attributes) {
      template.attributes = map(template.attributes, (attr) => {
        delete attr.new;
        return attr;
      });
    }
    if (template.sections) {
      template.sections = map(template.sections, (attr) => {
        delete attr.new;
        return attr;
      });
    }
    return context.dispatch('template/put', template, { root: true }).then((doc) => {
      context.commit('setTemplate', doc);
      context.commit('setEditMode', false);
    }).finally(() => {
      context.commit('setBusy', false);
    });
  },

  newDocument(context, document) {
    context.commit('setBusy', true);

    return context.dispatch('document/post', document, { root: true }).finally(() => {
      context.commit('setBusy', false);
    });
  },

  newTemplate(context, template) {
    context.commit('setBusy', true);

    return context.dispatch('template/post', template, { root: true }).finally(() => {
      context.commit('setBusy', false);
    });
  },

  search(context, term) {
    context.commit('setBusy', true);
    context.commit('setResults', { d: [], t: []});

    return context.dispatch('document/search', term, { root: true }).then((data) => {
      context.commit('setResults', data);
    }).finally(() => {
      context.commit('setBusy', false);
    });
  },

  setEditMode(context, value) {
    context.commit('setEditMode', value);
    return Promise.resolve();
  },
};

export const mutations: MutationTree<SessionState> = {
  cancelEdit(s: SessionState) {
    Vue.set(s, 'document', cloneDeep(state.originalDocument));
    Vue.set(s, 'template', cloneDeep(state.originalTemplate));
  },

  setBusy(s: SessionState, value: boolean) {
    Vue.set(s, 'busy', value);
  },

  setDocument(s: SessionState, document) {
    Vue.set(s, 'document', cloneDeep(document));
    Vue.set(s, 'originalDocument', cloneDeep(document));
  },

  setDocumentAttribute(s: SessionState, attribute: any) {
    if (!s.document.attributes) {
      s.document.attributes = {};
    }
    if (attribute.value) {
      Vue.set(s.document.attributes, attribute.id, attribute.value);
    } else {
      delete s.document.attributes[attribute.id];
    }
  },

  setDocumentSection(s: SessionState, section: any) {
    if (!s.document.sections) {
      s.document.sections = {};
    }
    if (section.value) {
      s.document.sections[section.id] = section.value;
    } else {
      delete s.document.sections[section.id];
    }
  },

  setDocumentSynopsis(s: SessionState, synopsis: string) {
    state.document.synopsis = synopsis;
  },

  setDocumentTitle(s: SessionState, title: string) {
    state.document.title = title;
  },

  setEditMode(s: SessionState, value: boolean) {
    if (value) {
      s.mode = SessionViewEnum.EDIT;
    } else {
      s.mode = SessionViewEnum.VIEW;
    }
  },

  setResults(s: SessionState, results) {
    Vue.set(s, 'searchResults', cloneDeep(results));
  },

  setTemplate(s: SessionState, template) {
    Vue.set(s, 'template', cloneDeep(template));
    Vue.set(s, 'originalTemplate', cloneDeep(template));
  },

  setTemplateAttribute(s: SessionState, attribute) {
    if (!s.template.attributes) {
      s.template.attributes = [];
    }

    const idx = findIndex(s.template.attributes, { id: attribute.id });
    if (idx >= 0) {
      if (attribute.name) {
        Vue.set(s.template.attributes[idx], 'name', attribute.name);
      } else {
        Vue.delete(s.template.attributes[idx], 'name');
      }
      if (attribute.deprecated) {
        // state.template.attributes[idx] = { ...state.template.attributes[idx], deprecated: true };
        Vue.set(s.template.attributes[idx], 'deprecated', true);
      } else {
        Vue.delete(s.template.attributes[idx], 'deprecated');
      }
      if (attribute.data) {
        // state.template.attributes[idx] = { ...state.template.attributes[idx], deprecated: true };
        Vue.set(s.template.attributes[idx], 'data', attribute.data);
      } else {
        Vue.delete(s.template.attributes[idx], 'data');
      }
    } else {
      s.template.attributes.unshift(attribute);
    }
  },

  setTemplateSection(s: SessionState, section) {
    if (!s.template.sections) {
      s.template.sections = [];
    }

    const idx = findIndex(s.template.sections, { id: section.id });
    if (idx >= 0) {
      if (section.name) {
        Vue.set(s.template.sections[idx], 'name', section.name);
      } else {
        Vue.delete(s.template.sections[idx], 'name');
      }
      if (section.deprecated) {
        Vue.set(s.template.sections[idx], 'deprecated', true);
      } else {
        Vue.delete(s.template.sections[idx], 'deprecated');
      }
      if (section.data) {
        Vue.set(s.template.sections[idx], 'data', section.data);
      } else {
        Vue.delete(s.template.sections[idx], 'data');
      }
    } else {
      s.template.sections.unshift(section);
    }
  },

  moveTemplateAttribute(s: SessionState, { oldIndex, newIndex }) {
    const newArray = s.template.attributes.slice();
    newArray.splice((newIndex < 0 ? newArray.length + newIndex : newIndex), 0, newArray.splice(oldIndex, 1)[0]);
    Vue.set(s.template, 'attributes', newArray);
  },

  moveTemplateSection(s: SessionState, { oldIndex, newIndex }) {
    const newArray = s.template.sections.slice();
    newArray.splice((newIndex < 0 ? newArray.length + newIndex : newIndex), 0, newArray.splice(oldIndex, 1)[0]);
    Vue.set(s.template, 'sections', newArray);
  }
};

export const getters: GetterTree<SessionState, RootState> = {
  themeColor(s: SessionState): string {
    return s.themeColor;
  },

  isEditMode(s: SessionState): boolean {
    return s.mode === SessionViewEnum.EDIT;
  },

  isDocumentDirty(s: SessionState): boolean {
    return !isEqual(s.document, s.originalDocument);
  },

  isTemplateDirty(s: SessionState): boolean {
    return !isEqual(s.template, s.originalTemplate);
  },
};

export const session: Module<SessionState, RootState> = {
  namespaced,
  state,
  actions,
  getters,
  mutations,
};
