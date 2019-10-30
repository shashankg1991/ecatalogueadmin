<template>
  <div class="marginTop">
    <b-container class="marginTop" v-if="!showAddsection">
      <b-row class="marginTop">
        <b-col cols="6" align-v="end">
          <b-form-input type="text" v-model="searchterm" placeholder="Search categories" />
        </b-col>
        <b-col cols="6">
          <b-button variant="primary" @click="viewAddSection">Add new category</b-button>
          <b-button variant="danger" @click="deleteAll">Delete All</b-button>
          <b-button variant="secondary" @click="onPickUploadFile">Upload</b-button>
          <input type="file" hidden @change="onImportFilePicked" ref="fileUpload" />
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
            <b-form-group label="Brand:" label-for="brand">
              <b-form-select
                id="brand"
                required
                placeholder="Brand"
                v-model="modifiedCategory.brand"
                :options="brandNames"
              ></b-form-select>
            </b-form-group>
            <b-button center variant="primary" @click="addCategory">Save</b-button>
          </b-form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
export default {
  data() {
    return {
      fields: ["name", "brand", "actions"],
      searchterm: "",
      modifiedCategory: {
        name: ""
      },
      showAddsection: false,
      isEdit: false
    };
  },
  computed: {
    ...mapState(["currentUser", "categories", "brands"]),
    filteredCategories: function() {
      return this.categories.filter(category => {
        return category.name
          .toLowerCase()
          .trim()
          .match(this.searchterm.toLowerCase().trim());
      });
    },
    brandNames: function() {
      return this.brands.map(brand => {
        return brand.name;
      });
    }
  },
  methods: {
    addCategory() {
      if (this.isEdit) {
        fb.categoriesCollection
          .doc(this.modifiedCategory.id)
          .set(this.modifiedCategory)
          .then(doc => {
            this.modifiedCategory.name = "";
            this.modifiedCategory.brand = "";
            this.showAddsection = false;
            this.isEdit = false;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        fb.categoriesCollection
          .add({
            name: this.modifiedCategory.name,
            brand: this.modifiedCategory.brand
          })
          .then(doc => {
            this.modifiedCategory.name = "";
            this.modifiedCategory.brand = "";
            this.showAddsection = false;
            this.isEdit = false;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    editCategory(category) {
      this.isEdit = true;
      this.modifiedCategory = category;
      this.showAddsection = true;
    },
    deleteCategory(id) {
      fb.categoriesCollection
        .doc(id)
        .delete()
        .catch(err => {
          console.log(err);
        });
    },
    viewAddSection() {
      this.showAddsection = true;
    },
    closePostModal() {
      this.showAddsection = false;
    },
    deleteAll() {
      this.categories.forEach(c => {
        fb.categoriesCollection
          .doc(c.id)
          .delete()
          .catch(err => {
            console.log(err);
          });
      });
    },
    onPickUploadFile() {
      this.$refs.fileUpload.click();
    },
    onImportFilePicked(event) {
      var reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      var fileinput;
      reader.onload = e => {
        fileinput = e.target.result;
        var lines = fileinput.split("\n");
        // Need to create a map as, by the time response comes from firebase, the data object gets modified by next iteration
        // Line 0 is header line
        for (var lineNumber = 1; lineNumber < lines.length; lineNumber++) {
          var data = lines[lineNumber].split(",");
          console.info("Entry : " + lines[lineNumber].split(","));
          this.importData(data);
        }
      };
    },
    importData(data) {
      if (data[0] !== "" && data.length === 2) {
        fb.categoriesCollection.add({
          name: data[0],
          brand: data[1]
        });
      }
    }
  }
};
</script>
