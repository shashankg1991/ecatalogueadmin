<template>
  <div class="marginTop">
    <b-container class="marginTop" v-if="!showAddsection">
      <b-row class="marginTop">
        <b-col cols="8" align-v="end">
          <b-row>
            <b-col cols="4">
              <b-form-input type="text" v-model="searchterm" placeholder="Search items"/>
            </b-col>
            <b-col cols="4">
              <b-form-input
                type="text"
                v-model="searchcategoryterm"
                placeholder="Search items by category"
              />
            </b-col>
            <b-col cols="4">
              <b-form-input
                type="text"
                v-model="searchbrandterm"
                placeholder="Search items by brand"
              />
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="2">
          <b-button variant="primary" @click="viewAddSection">Add new item</b-button>
        </b-col>
        <b-col cols="2">
          <b-button center variant="secondary" @click="onPickUploadFile">Upload Items</b-button>
          <input type="file" hidden @change="onImportFilePicked" ref="fileUpload">
        </b-col>
      </b-row>

      <b-table
        v-if="filteredItems.length"
        borderless
        outlined
        hover
        :items="filteredItems"
        :fields="fields"
        class="marginTop"
      >
      <template slot="price" slot-scope="data">
          {{data.item.price|currency('₹')}}
        </template>
        <template slot="image" slot-scope="data">
          <img :src="data.item.imageurl" width="50">
        </template>
        <template slot="actions" slot-scope="data">
          <b-button variant="outline-primary" @click="editItem(data.item)">Edit</b-button>
          <b-button class="marginTop" variant="danger" @click="deleteItem(data.item.id)">Delete</b-button>
        </template>
      </b-table>

      <div v-else>
        <p class="no-results">There are currently no items</p>
      </div>
    </b-container>

    <transition name="fade">
      <div v-if="showAddsection" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal" class="close">X</a>
          <b-form class="post">
            <b-form-group label="Code:" label-for="code">
              <b-form-input
                id="input-1"
                v-model="modifiedItem.code"
                type="text"
                required
                placeholder="Code"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Brand:" label-for="brand">
              <b-form-select
                id="brand"
                required
                placeholder="Brand"
                v-model="modifiedItem.brand"
                :options="brandNames"
              ></b-form-select>
            </b-form-group>
            <b-form-group label="Category:" label-for="category">
              <b-form-select
                id="category"
                required
                placeholder="Category"
                v-model="modifiedItem.category"
                :options="categoryNames"
              ></b-form-select>
            </b-form-group>
            <b-form-group label="Name:" label-for="name">
              <b-form-input
                id="name"
                v-model="modifiedItem.name"
                type="text"
                required
                placeholder="Name"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Description:" label-for="description">
              <b-form-input
                id="description"
                v-model="modifiedItem.description"
                type="text"
                placeholder="Description"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Price:" label-for="price">
              <b-form-input
                id="price"
                v-model="modifiedItem.price"
                type="number"
                required
                placeholder="Price"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Image:" class="marginTop" label-for="imageurl">
              <b-form-input
                id="imageurl"
                v-model="modifiedItem.imageurl"
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
            <b-button center variant="primary" @click="addItem">Save</b-button>
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
      fields: [
        'image',
        'code',
        'name',
        'price',
        'category',
        'brand',
        'description',
        'actions'
      ],
      imageUrl: '',
      imageFile: '',
      image: '',
      searchterm: '',
      searchcategoryterm: '',
      searchbrandterm: '',
      modifiedItem: {
        id: '',
        code: '',
        name: '',
        description: '',
        category: '',
        brand: '',
        imageurl: '',
        price: ''
      },
      showAddsection: false,
      isEdit: false
    }
  },
  computed: {
    ...mapState(['currentUser', 'items', 'categories', 'brands']),
    filteredItems: function () {
      return this.items.filter(item => {
        return (
          (item.code
            .toLowerCase()
            .trim()
            .match(this.searchterm.toLowerCase().trim()) ||
            item.name
              .toLowerCase()
              .trim()
              .match(this.searchterm.toLowerCase().trim())) &&
          item.category
            .toLowerCase()
            .trim()
            .match(this.searchcategoryterm.toLowerCase().trim()) &&
          item.brand
            .toLowerCase()
            .trim()
            .match(this.searchbrandterm.toLowerCase().trim())
        )
      })
    },
    categoryNames: function () {
      return this.categories.map(category => {
        return category.name
      })
    },
    brandNames: function () {
      return this.brands.map(brand => {
        return brand.name
      })
    }
  },
  methods: {
    addItem () {
      if (this.imageUrl) {
        fb.storage
          .ref('items/' + this.imageFile.name)
          .put(this.imageFile)
          .then(filedata => {
            filedata.ref.getDownloadURL().then(url => {
              this.modifiedItem.imageurl = url
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
        fb.itemsCollection
          .doc(this.modifiedItem.id)
          .set(this.modifiedItem)
          .then(doc => {
            this.modifiedItem.id = ''
            this.modifiedItem.code = ''
            this.modifiedItem.name = ''
            this.modifiedItem.description = ''
            this.modifiedItem.category = ''
            this.modifiedItem.brand = ''
            this.modifiedItem.imageurl = ''
            this.modifiedItem.price = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        fb.itemsCollection
          .add({
            code: this.modifiedItem.code,
            name: this.modifiedItem.name,
            description: this.modifiedItem.description,
            category: this.modifiedItem.category,
            brand: this.modifiedItem.brand,
            imageurl: this.modifiedItem.imageurl,
            price: this.modifiedItem.price
          })
          .then(doc => {
            this.modifiedItem.id = ''
            this.modifiedItem.code = ''
            this.modifiedItem.name = ''
            this.modifiedItem.description = ''
            this.modifiedItem.category = ''
            this.modifiedItem.brand = ''
            this.modifiedItem.imageurl = ''
            this.modifiedItem.price = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    editItem (item) {
      this.isEdit = true
      this.modifiedItem.id = item.id
      this.modifiedItem.code = item.code
      this.modifiedItem.name = item.name
      this.modifiedItem.description = item.description
      this.modifiedItem.category = item.category
      this.modifiedItem.imageurl = item.imageurl
      this.modifiedItem.price = item.price
      this.showAddsection = true
    },
    deleteItem (id) {
      fb.itemsCollection
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
      this.modifiedItem.id = ''
      this.modifiedItem.code = ''
      this.modifiedItem.name = ''
      this.modifiedItem.description = ''
      this.modifiedItem.category = ''
      this.modifiedItem.imageurl = ''
      this.modifiedItem.price = ''
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
    },
    onPickUploadFile () {
      this.$refs.fileUpload.click()
    },
    onImportFilePicked (event) {
      var reader = new FileReader()
      reader.readAsText(event.target.files[0])
      var fileinput
      reader.onload = e => {
        fileinput = e.target.result
        var lines = fileinput.split('\n')
        // Need to create a map as, by the time response comes from firebase, the data object gets modified by next iteration
        // Line 0 is header line
        for (var lineNumber = 1; lineNumber < lines.length; lineNumber++) {
          var data = lines[lineNumber].split(',')
          console.info('Entry : ' + lines[lineNumber].split(','))
          this.importData(data)
        }
      }
    },

    importData (data) {
      if (data[0] !== '' && data.length === 6) {
        fb.itemsCollection
          .where('code', '==', data[0])
          .get()
          .then(querySnapshot => {
            if (querySnapshot.docs.length > 0) {
              var existingDoc = querySnapshot.docs[0].data()
              existingDoc.name = data[1]
              existingDoc.description = data[2]
              existingDoc.category = data[3]
              existingDoc.brand = data[4]
              existingDoc.price = data[5]
              fb.itemsCollection.doc(querySnapshot.docs[0].id).set(existingDoc)
            } else {
              fb.itemsCollection
                .add({
                  code: data[0],
                  name: data[1],
                  description: data[2],
                  category: data[3],
                  brand: data[4],
                  price: data[5]
                })
                .catch(err => {
                  console.log(err)
                })
            }
          })
      }
    }
  }
}
</script>
