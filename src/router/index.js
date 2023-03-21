import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CapitalH from '../components/CapitalH.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomeView,
    name: 'Login'
  },
  {
    path: '/CapitalHumano',
    component: CapitalH,
    name: 'CapitalHumano',
    meta: {
      requiresAuth: true
    }
    // component: () => import(/* webpackChunkName: "about" */ '../components/CapitalH.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.token != undefined) {
      next();
    } else {
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router
