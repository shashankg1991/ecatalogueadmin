import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Vue2Filters from 'vue2-filters'

import Login from '@/components/Login'
import Users from '@/components/Users'
import MasterInfos from '@/components/MasterInfos'
import Items from '@/components/Items'
import Categories from '@/components/Categories'
import Brands from '@/components/Brands'
import HomeScreen from '@/components/HomeScreen'

Vue.use(Router)
Vue.use(Vue2Filters)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'HomeScreen',
      component: HomeScreen,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/masters',
      name: 'MasterInfos',
      component: MasterInfos,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/brands',
      name: 'Brands',
      component: Brands,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/items',
      name: 'Items',
      component: Items,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

export default router
