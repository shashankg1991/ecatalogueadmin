<template>
  <div class="marginTop">
    <b-container class="marginTop" v-if="!showAddsection">
      <b-row class="marginTop">
        <b-col cols="6" align-v="end">
          <b-form-input type="text" v-model="searchterm" placeholder="Search brands"/>
        </b-col>
        <b-col cols="3">
          <b-button variant="primary" @click="viewAddSection">Add new brand</b-button>
        </b-col>
      </b-row>
      <b-table
        v-if="filteredBrands.length"
        borderless
        outlined
        hover
        :items="filteredBrands"
        :fields="fields"
        class="marginTop"
      >
        <template slot="image" slot-scope="data">
          <img :src="data.item.imageurl" width="200">
        </template>
        <template slot="actions" slot-scope="data">
          <b-button variant="outline-primary" @click="editBrand(data.item)">Edit</b-button>
          <b-button variant="danger" @click="deleteBrand(data.item.id)">Delete</b-button>
        </template>
      </b-table>
      <div v-else>
        <p class="no-results">There are currently no brands</p>
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
                v-model="modifiedBrand.name"
                type="text"
                required
                placeholder="Name"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Image:" class="marginTop" label-for="imageurl">
              <b-form-input
                id="imageurl"
                v-model="modifiedBrand.imageurl"
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
            <b-button center variant="primary" @click="addBrand">Save</b-button>
          </b-form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig.js')
export default {
  data () {
    return {
      fields: ['image', 'name', 'actions'],
      imageUrl: '',
      imageFile: '',
      image: '',
      searchterm: '',
      modifiedBrand: {
        name: '',
        imageurl: '',
      },
      showAddsection: false,
      isEdit: false
    }
  },
  computed: {
    ...mapState(['currentUser', 'brands']),
    filteredBrands: function () {
      return this.brands.filter(brand => {
        return brand.name
          .toLowerCase()
          .trim()
          .match(this.searchterm.toLowerCase().trim())
      })
    }
  },
  methods: {
    addBrand () {
      if (this.imageUrl) {
        fb.storage
          .ref('brands/' + this.imageFile.name)
          .put(this.imageFile)
          .then(filedata => {
            filedata.ref.getDownloadURL().then(url => {
              this.modifiedBrand.imageurl = url
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
        fb.brandsCollection
          .doc(this.modifiedBrand.id)
          .set(this.modifiedBrand)
          .then(doc => {
            this.modifiedBrand.name = ''
            this.modifiedBrand.imageurl = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        fb.brandsCollection
          .add({
            name: this.modifiedBrand.name,
            imageurl: this.modifiedBrand.imageurl
          })
          .then(doc => {
            this.modifiedBrand.name = ''
            this.modifiedBrand.imageurl = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    editBrand (brand) {
      this.isEdit = true
      this.modifiedBrand = brand
      this.showAddsection = true
    },
    deleteBrand (id) {
      fb.brandsCollection
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
