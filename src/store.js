import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    fb.usersCollection.onSnapshot(querySnapshot => {
      let usersArray = []
      querySnapshot.forEach(doc => {
        let user = doc.data()
        user.id = doc.id
        usersArray.push(user)
      })
      store.commit('setUsers', usersArray)
      fb.userpermissionsCollection.onSnapshot(querySnapshot => {
        let userpermissionsArray = []
        querySnapshot.forEach(doc => {
          let userpermission = doc.data()
          userpermission.id = doc.id
          usersArray.filter(u => u.id === userpermission.id).forEach(fu => fu.userpermission = userpermission)
          userpermissionsArray.push(userpermission)
        })
        store.commit('setUserpermissions', userpermissionsArray)
      })
    });

    fb.userpermissionsCollection.onSnapshot(querySnapshot => {
      let userpermissionsArray = []
      querySnapshot.forEach(doc => {
        let userpermission = doc.data()
        userpermission.id = doc.id
        userpermissionsArray.push(userpermission)
      })
      store.commit('setUserpermissions', userpermissionsArray)
    })

    fb.itemsCollection.onSnapshot(querySnapshot => {
      let itemsArray = []
      querySnapshot.forEach(doc => {
        let item = doc.data()
        item.id = doc.id
        itemsArray.push(item)
      })
      store.commit('setItems', itemsArray)
    })

    fb.userpermissionsCollection.onSnapshot(querySnapshot => {
      let userpermissionsArray = []
      querySnapshot.forEach(doc => {
        let userpermission = doc.data()
        userpermission.id = doc.id
        userpermissionsArray.push(userpermission)
      })
      store.commit('setUserpermissions', userpermissionsArray)
    })

    fb.categoriesCollection.onSnapshot(querySnapshot => {
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
    categories: [],
    userpermissions: [],
  },
  actions: {
    clearData({
      commit
    }) {
      commit('setCurrentUser', null)
      commit('setUsers', null)
      commit('setItems', null)
      commit('setCategories', null)
      commit('setUserpermissions', null)
    }
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setUsers(state, val) {
      if (val) {
        state.users = val
      } else {
        state.users = []
      }
    },
    setItems(state, val) {
      if (val) {
        state.items = val
      } else {
        state.items = []
      }
    },
    setCategories(state, val) {
      if (val) {
        state.categories = val
      } else {
        state.categories = []
      }
    },
    setUserpermissions(state, val) {
      if (val) {
        state.userpermissions = val
        val.forEach(userpermission => {
          state.users.filter(u => u.id === userpermission.id).forEach(fu => fu.userpermission = userpermission)
        })
        state.users = state.users
      } else {
        state.userpermissions = []
      }
    },
    clearData(state) {
      state.currentUser = null
      state.users = []
      state.items = []
      state.categories = []
      state.userpermissions = []
    }
  }
})
