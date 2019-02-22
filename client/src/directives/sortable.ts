import Vue from 'vue';
import * as Sortable from 'sortablejs';

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const emit = (vnode, name, data) => {
  const handlers = (vnode.data && vnode.data.on)
    || (vnode.componentOptions && vnode.componentOptions.listeners);

  if (handlers && handlers[name]) {
    handlers[name].fns(data);
  }
};

Vue.directive('sortable', {
  bind(el, binding, vnode) {
    const sortable = new Sortable(
      el,
      {
        handle: binding.arg ? `.${binding.arg}` : '',
        group: uuidv4(),
        onEnd: ({ oldIndex, newIndex }) => {
          emit(vnode, 'reorder', { oldIndex, newIndex });
        },
      },
    );
  },
});
