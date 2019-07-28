import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    console.error(fb.usersCollection)
    fb.usersCollection.orderBy('u_id').onSnapshot(querySnapshot => {
      let usersArray = []
      querySnapshot.forEach(doc => {
        console.error(JSON.stringify(doc.data()))
        let user = doc.data()
        user.id = doc.u_id
        usersArray.push(user)
      })

      store.commit('setUsers', usersArray)
    })
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    users: []
  },
  actions: {
    clearData ({ commit }) {
      commit('setCurrentUser', null)
      commit('setUsers', null)
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
    }
  }
})
