<template>
  <div id="dashboard">
    <router-link to="/home">Home</router-link>
    <section v-if="!showAddsection">
      <a @click="viewAddSection">Add new user</a>
      <input type="text" v-model="searchterm" placeholder="Search users" />
      <ul v-if="filteredUsers.length">
        <li v-for="user in filteredUsers" :key="user.u_id" class="post">
          {{ user.id }}
          {{ user.u_id }}
          {{ user.name }}
          {{ user.password }}
          <button
            @click="editUser(user)"
          >Edit</button>
          <button @click="deleteUser(user.id)">Delete</button>
        </li>
      </ul>
      <div v-else>
        <p class="no-results">There are currently no users</p>
      </div>
    </section>
    <transition name="fade">
      <div v-if="showAddsection" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal" class="close">X</a>
          <div class="post">
            Name :
            <input v-model="modifiedUser.name" />
            password :
            <input v-model="modifiedUser.password" />
            <button v-if="modifiedUser.name && modifiedUser.password" @click="addUser">Save</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { uuid } from 'vue-uuid'
const fb = require('../firebaseConfig.js')
export default {
  data () {
    return {
      searchterm: '',
      modifiedUser: {
        id: '',
        name: '',
        password: '',
        u_id: ''
      },
      showAddsection: false,
      isEdit: false
    }
  },
  computed: {
    ...mapState(['currentUser', 'users']),
    filteredUsers: function () {
      return this.users.filter(user => {
        return user.name
          .toLowerCase()
          .trim()
          .match(this.searchterm.toLowerCase().trim())
      })
    }
  },
  methods: {
    addUser () {
      if (this.isEdit) {
        fb.usersCollection
          .doc(this.modifiedUser.id)
          .set(this.modifiedUser)
          .then(doc => {
            this.modifiedUser.name = ''
            this.modifiedUser.password = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        fb.usersCollection
          .add({
            u_id: uuid.v1(),
            name: this.modifiedUser.name,
            password: this.modifiedUser.password
          })
          .then(doc => {
            this.modifiedUser.name = ''
            this.modifiedUser.password = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    editUser (user) {
      this.isEdit = true
      this.modifiedUser = user
      this.showAddsection = true
    },
    deleteUser (id) {
      fb.usersCollection
        .doc(id)
        .delete()
        .catch(err => {
          console.log(err)
        })
    },
    viewAddSection () {
      this.showAddsection = true
    },
    closePostModal () {
      this.showAddsection = false
    }
  }
}
</script>
