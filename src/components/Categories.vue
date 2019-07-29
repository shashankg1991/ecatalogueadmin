<template>
  <div id="dashboard">
    <router-link to="/home">Home</router-link>
    <section v-if="!showAddsection">
      <a @click="viewAddSection">Add new category</a>
      <input type="text" v-model="searchterm" placeholder="Search categories" />
      <ul v-if="filteredCategories.length">
        <li v-for="category in filteredCategories" :key="category.u_id" class="post">
          {{ category.id }}
          {{ category.u_id }}
          {{ category.name }}
          {{ category.imageurl }}
          <button
            @click="editCategory(category)"
          >Edit</button>
          <button @click="deleteCategory(category.id)">Delete</button>
        </li>
      </ul>
      <div v-else>
        <p class="no-results">There are currently no categories</p>
      </div>
    </section>
    <transition name="fade">
      <div v-if="showAddsection" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal" class="close">X</a>
          <div class="post">
            Name :
            <input v-model="modifiedCategory.name" />
            Image :
            <input v-model="modifiedCategory.imageurl" />
            <button v-if="modifiedCategory.name" @click="addCategory">Save</button>
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
      modifiedCategory: {
        name: '',
        imageurl: '',
        u_id: ''
      },
      showAddsection: false,
      isEdit: false
    }
  },
  computed: {
    ...mapState(['currentUser', 'categories']),
    filteredCategories: function () {
      return this.categories.filter(category => {
        return category.name
          .toLowerCase()
          .trim()
          .match(this.searchterm.toLowerCase().trim())
      })
    }
  },
  methods: {
    addCategory () {
      if (this.isEdit) {
        fb.categoriesCollection
          .doc(this.modifiedCategory.id)
          .set(this.modifiedCategory)
          .then(doc => {
            this.modifiedCategory.name = ''
            this.modifiedCategory.imageurl = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        fb.categoriesCollection
          .add({
            u_id: uuid.v1(),
            name: this.modifiedCategory.name,
            imageurl: this.modifiedCategory.imageurl
          })
          .then(doc => {
            this.modifiedCategory.u_id = ''
            this.modifiedCategory.name = ''
            this.modifiedCategory.imageurl = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    editCategory (category) {
      this.isEdit = true
      this.modifiedCategory = category
      this.showAddsection = true
    },
    deleteCategory (id) {
      fb.categoriesCollection
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
