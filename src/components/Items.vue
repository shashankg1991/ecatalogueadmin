<template>
  <div id="dashboard">
    <router-link to="/home">Home</router-link>
    <section v-if="!showAddsection">
      <a @click="viewAddSection">Add new item</a>
      <input type="text" v-model="searchterm" placeholder="Search items" />
      <ul v-if="filteredItems.length">
        <li v-for="item in filteredItems" :key="item.u_id" class="post">
          {{ item.id }}
          {{ item.u_id }}
          {{ item.code }}
          {{ item.category }}
          {{ item.name }}
          {{ item.description }}
          {{ item.price }}
          {{ item.imageurl }}
          <button
            @click="editItem(item)"
          >Edit</button>
          <button @click="deleteItem(item.id)">Delete</button>
        </li>
      </ul>
      <div v-else>
        <p class="no-results">There are currently no items</p>
      </div>
    </section>
    <transition name="fade">
      <div v-if="showAddsection" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal" class="close">X</a>
          <div class="post">
            Code :
            <input v-model="modifiedItem.code" />
            Category :
            <input v-model="modifiedItem.category" />
            Name :
            <input v-model="modifiedItem.name" />
            Description :
            <input v-model="modifiedItem.description" />
            Price :
            <input v-model="modifiedItem.price" />
            Image :
            <input v-model="modifiedItem.imageurl" />
            <button
              v-if="modifiedItem.code && modifiedItem.category && modifiedItem.name && modifiedItem.description && modifiedItem.price"
              @click="addItem"
            >Save</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { uuid } from "vue-uuid";
const fb = require("../firebaseConfig.js");
export default {
  data() {
    return {
      searchterm: "",
      modifiedItem: {
        id: "",
        code: "",
        name: "",
        description: "",
        category: "",
        u_id: "",
        imageurl: "",
        price: ""
      },
      showAddsection: false,
      isEdit: false
    };
  },
  computed: {
    ...mapState(["currentUser", "items"]),
    filteredItems: function() {
      return this.items.filter(item => {
        return (
          item.code
            .toLowerCase()
            .trim()
            .match(this.searchterm.toLowerCase().trim()) ||
          item.name
            .toLowerCase()
            .trim()
            .match(this.searchterm.toLowerCase().trim()) ||
          item.category
            .toLowerCase()
            .trim()
            .match(this.searchterm.toLowerCase().trim())
        );
      });
    }
  },
  methods: {
    addItem() {
      if (this.isEdit) {
        fb.itemsCollection
          .doc(this.modifiedItem.id)
          .set(this.modifiedItem)
          .then(doc => {
            this.modifiedItem.id = "";
            this.modifiedItem.code = "";
            this.modifiedItem.name = "";
            this.modifiedItem.description = "";
            this.modifiedItem.category = "";
            this.modifiedItem.u_id = "";
            this.modifiedItem.imageurl = "";
            this.modifiedItem.price = "";
            this.showAddsection = false;
            this.isEdit = false;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        fb.itemsCollection
          .add({
            u_id: uuid.v1(),
            code: this.modifiedItem.code,
            name: this.modifiedItem.name,
            description: this.modifiedItem.description,
            category: this.modifiedItem.category,
            imageurl: this.modifiedItem.imageurl,
            price: this.modifiedItem.price
          })
          .then(doc => {
            this.modifiedItem.id = "";
            this.modifiedItem.code = "";
            this.modifiedItem.name = "";
            this.modifiedItem.description = "";
            this.modifiedItem.category = "";
            this.modifiedItem.u_id = "";
            this.modifiedItem.imageurl = "";
            this.modifiedItem.price = "";
            this.showAddsection = false;
            this.isEdit = false;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    editItem(item) {
      this.isEdit = true;
      this.modifiedItem = item;
      this.showAddsection = true;
    },
    deleteItem(id) {
      fb.itemsCollection
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
    }
  }
};
</script>
