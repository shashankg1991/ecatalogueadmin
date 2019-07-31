<template>
  <div class="marginTop">
    <b-container class="marginTop" v-if="!showAddsection">
      <b-row class="marginTop">
        <b-col cols="6" align-v="end">
          <b-form-input type="text" v-model="searchterm" placeholder="Search categories"/>
        </b-col>
        <b-col cols="3">
          <b-button variant="primary" @click="viewAddSection">Add new category</b-button>
        </b-col>
      </b-row>
      <b-table
        v-if="filteredCategories.length"
        borderless
        outlined
        hover
        :items="filteredCategories"
        :fields="fields"
        class="marginTop"
      >
        <template slot="image" slot-scope="data">
          <img :src="data.item.imageurl" height="100">
        </template>
        <template slot="actions" slot-scope="data">
          <b-button variant="outline-primary" @click="editCategory(data.item)">Edit</b-button>
          <b-button variant="danger" @click="deleteCategory(data.item.id)">Delete</b-button>
        </template>
      </b-table>
      <div v-else>
        <p class="no-results">There are currently no categories</p>
      </div>
    </b-container>
    <transition name="fade">
      <div v-if="showAddsection" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal" class="close">X</a>
          <b-form class="post">
            <b-form-group label="Name:" label-for="name">
              <b-form-input
                id="name"
                v-model="modifiedCategory.name"
                type="text"
                required
                placeholder="Name"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Image:" class="marginTop" label-for="imageurl">
              <b-form-input
                id="imageurl"
                v-model="modifiedCategory.imageurl"
                type="text"
                placeholder="Image URL"
              ></b-form-input>
              <b-img class="marginTop" :src="imageUrl"></b-img>
              <b-button
                center
                variant="secondary"
                class="marginTop"
                @click="onPickFile"
              >Upload Image</b-button>
              <input type="file" accept="image/*" @change="onFilePicked" hidden ref="fileInput">
            </b-form-group>
            <b-button center variant="primary" @click="addCategory">Save</b-button>
          </b-form>
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
      fields: ['image', 'name', 'actions'],
      imageUrl: '',
      imageFile: '',
      image: '',
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
      if (this.imageUrl) {
        fb.storage
          .ref('categories/' + this.imageFile.name)
          .put(this.imageFile)
          .then(filedata => {
            filedata.ref.getDownloadURL().then(url => {
              this.modifiedCategory.imageurl = url
              this.imageUrl = ''
              this.imageFile = ''
              this.image = ''
              this.saveItem()
            })
          })
      } else {
        this.saveItem()
      }
    },
    saveItem () {
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
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
        this.imageFile = event.target.files[0]
      })
      this.image = fileReader.readAsDataURL(event.target.files[0])
    }
  }
}
</script>
