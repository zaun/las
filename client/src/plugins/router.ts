import Vue from 'vue';
import Router from 'vue-router';

import Home from '../views/Home.vue';
import store from '../store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/d/:title',
      name: 'document',
      // route level code-splitting
      // this generates a separate chunk (blank.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "document" */ '../views/Document.vue'),
    },
    {
      path: '/t/:name',
      name: 'template',
      // route level code-splitting
      // this generates a separate chunk (blank.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "template" */ '../views/Template.vue'),
    },
    {
      path: '/u/:username',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (blank.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "document" */ '../views/Document.vue'),
    },
    {
      path: '/q/:search',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (blank.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
    },
    { path: '*', redirect: '/' },
  ],
});

router.beforeEach((to, from, next) => {
  store.dispatch('session/cancelEdit');
  next();
});

router.beforeResolve((to, from, next) => {
  next();
});

// router.afterEach((to, from) => {
// });

export default router;
