import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    fb.usersCollection.orderBy('u_id').onSnapshot(querySnapshot => {
      let usersArray = []
      querySnapshot.forEach(doc => {
        let user = doc.data()
        user.id = doc.id
        usersArray.push(user)
      })
      store.commit('setUsers', usersArray)
    })

    fb.itemsCollection.orderBy('u_id').onSnapshot(querySnapshot => {
      let itemsArray = []
      querySnapshot.forEach(doc => {
        let item = doc.data()
        item.id = doc.id
        itemsArray.push(item)
      })
      store.commit('setItems', itemsArray)
    })

    fb.categoriesCollection.orderBy('u_id').onSnapshot(querySnapshot => {
      let categoriesArray = []
      querySnapshot.forEach(doc => {
        let category = doc.data()
        category.id = doc.id
        categoriesArray.push(category)
      })
      store.commit('setCategories', categoriesArray)
    })
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    users: [],
    items: [],
    categories: []
  },
  actions: {
    clearData ({ commit }) {
      commit('setCurrentUser', null)
      commit('setUsers', null)
      commit('setItems', null)
      commit('setCategories', null)
    }
  },
  mutations: {
    setCurrentUser (state, val) {
      state.currentUser = val
    },
    setUsers (state, val) {
      if (val) {
        state.users = val
      } else {
        state.users = []
      }
    },
    setItems (state, val) {
      if (val) {
        state.items = val
      } else {
        state.items = []
      }
    },
    setCategories (state, val) {
      if (val) {
        state.categories = val
      } else {
        state.categories = []
      }
    }
  }
})
