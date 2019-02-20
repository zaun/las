import Vue from 'vue';
import * as Sortable from 'sortablejs';

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
      el.getElementsByTagName('tbody')[0],
      {
        handle: binding.arg ? `.${binding.arg}` : '',
        onEnd: ({ oldIndex, newIndex }) => {
          emit(vnode, 'reorder', { oldIndex, newIndex });
        },
      },
    );
  },
});
