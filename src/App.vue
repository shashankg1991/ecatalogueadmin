<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info" v-if="currentUser">
      <b-navbar-brand href="/home">eCatalogue Management</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/users">Users</b-nav-item>
        <b-nav-item href="/items">Items</b-nav-item>
        <b-nav-item href="/categories">Categories</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto" >
        <b-nav-item right @click="signOut">Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('./firebaseConfig.js')
export default {
  name: 'App',
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    signOut: function () {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.commit('clearData')
          this.$router.push('/login')
          this.user = null
        })
        .catch(err => console.log(err))
    }
  }
}
</script>
