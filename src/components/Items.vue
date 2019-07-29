<template>
  <div id="dashboard">
    <router-link to="/home">Home</router-link>
    <section v-if="!showAddsection">
      <a @click="viewAddSection">Add new item</a>
      <input type="text" v-model="searchterm" placeholder="Search items">
      <input type="file" @change="onImportFilePicked">
      <ul v-if="filteredItems.length">
        <li v-for="item in filteredItems" :key="item.u_id" class="post">
          <img :src="item.imageurl" height="100">
          {{ item.id }}
          {{ item.u_id }}
          {{ item.code }}
          {{ item.category }}
          {{ item.name }}
          {{ item.description }}
          {{ item.price }}
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
            <input v-model="modifiedItem.code">
            Category :
            <input v-model="modifiedItem.category">
            Name :
            <input v-model="modifiedItem.name">
            Description :
            <input v-model="modifiedItem.description">
            Price :
            <input v-model="modifiedItem.price">
            Image :
            <input v-model="modifiedItem.imageurl">
            <button class="primary" @click="onPickFile">Upload Image</button>
            <input type="file" accept="image/*" @change="onFilePicked" hidden ref="fileInput">
            <img :src="imageUrl" height="150">
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
      imageUrl: "",
      imageFile: "",
      image: "",
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
      if (this.imageUrl) {
        fb.storage
          .ref("items/" + this.imageFile.name)
          .put(this.imageFile)
          .then(filedata => {
            filedata.ref.getDownloadURL().then(url => {
              this.modifiedItem.imageurl = url;
              this.imageUrl = "";
              this.imageFile = "";
              this.image = "";
              this.saveItem();
            });
          });
      } else {
        this.saveItem();
      }
    },

    saveItem() {
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
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
        this.imageFile = event.target.files[0];
      });
      this.image = fileReader.readAsDataURL(event.target.files[0]);
    },
    onImportFilePicked(event) {
      var reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      var fileinput;
      reader.onload = e => {
        fileinput = e.target.result;
        var lines = fileinput.split("\n");
        //Need to create a map as, by the time response comes from firebase, the data object gets modified by next iteration
        var keyDataMap = new Object();
        //Line 0 is header line
        for (var lineNumber = 1; lineNumber < lines.length; lineNumber++) {
          var data = lines[lineNumber].split(",");
          console.error("lineNumber" + lines[lineNumber].split(","));
          if (data[0] != "") {
            keyDataMap[data[0]] = data;
            fb.itemsCollection
              .where("code", "==", data[0])
              .get()
              .then(querySnapshot => {
                if (querySnapshot.docs.length > 0) {
                  console.error(
                    "found" + keyDataMap[querySnapshot.docs[0].data().code]
                  );
                  var existingDoc = querySnapshot.docs[0].data();
                  existingDoc.name =
                    keyDataMap[querySnapshot.docs[0].data().code][1];
                  existingDoc.description =
                    keyDataMap[querySnapshot.docs[0].data().code][2];
                  existingDoc.category =
                    keyDataMap[querySnapshot.docs[0].data().code][3];
                  existingDoc.price =
                    keyDataMap[querySnapshot.docs[0].data().code][4];
                  fb.itemsCollection
                    .doc(querySnapshot.docs[0].id)
                    .set(existingDoc);
                } else {
                  console.error("not found" + data);
                  fb.itemsCollection
                    .add({
                      u_id: uuid.v1(),
                      code: data[0],
                      name: data[1],
                      description: data[2],
                      category: data[3],
                      price: data[4]
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              });
          } else {
            console.error("blank" + data);
            fb.itemsCollection
              .add({
                u_id: uuid.v1(),
                code: data[1],
                name: data[2],
                description: data[3],
                category: data[4],
                price: data[5]
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      };
    }
  }
};
</script>
