<template>
  <div class="marginTop">
    <b-container class="marginTop" v-if="!showAddsection">
      <b-row class="marginTop">
        <b-col cols="6" align-v="end">
          <b-form-input type="text" v-model="searchterm" placeholder="Search masterInfos"/>
        </b-col>
        <b-col cols="3">
          <b-button variant="primary" @click="viewAddSection">Add new masterInfo</b-button>
        </b-col>
      </b-row>
      <b-table
        v-if="masterInfos"
        borderless
        outlined
        hover
        :items="masterInfos"
        :fields="fields"
        class="marginTop"
      >
        <template slot="logoimageurl" slot-scope="data">
          <img :src="data.item.logoimageurl" width="100">
        </template>
         <template slot="mainbannerurl" slot-scope="data">
          <img :src="data.item.mainbannerurl" width="100">
        </template>
        <template slot="actions" slot-scope="data">
          <b-button variant="outline-primary" @click="editMasterInfo(data.item)">Edit</b-button>
          <b-button variant="danger" @click="deleteMasterInfo(data.item.id)">Delete</b-button>
        </template>
      </b-table>
      <div v-else>
        <p class="no-results">There are currently no masterInfos</p>
      </div>
    </b-container>
    <transition name="fade">
      <div v-if="showAddsection" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal" class="close">X</a>
          <b-form class="post">
            <b-form-group label="Application:" label-for="applicationname">
              <b-form-input
                id="applicationname"
                v-model="modifiedMasterInfo.applicationname"
                type="text"
                required
                placeholder="Application Name"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Offer:" label-for="promotiontext">
              <b-form-input
                id="promotiontext"
                v-model="modifiedMasterInfo.promotiontext"
                type="text"
                required
                placeholder="Offer of the day"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Show Brands:" label-for="showbrandspage">
              <b-form-select
                id="showbrandspage"
                required
                placeholder="Display brands on start?"
                v-model="modifiedMasterInfo.showbrandspage"
                :options="showBrandsOptions"
              ></b-form-select>
            </b-form-group>
            <b-form-group label="Logo Image:" class="marginTop" label-for="logoimageurl">
              <b-form-input
                id="logoimageurl"
                v-model="modifiedMasterInfo.logoimageurl"
                type="text"
                placeholder="Logo Image URL"
              ></b-form-input>
              <b-img class="marginTop" :src="logoImageUrl"></b-img>
              <b-button
                center
                variant="secondary"
                class="marginTop"
                @click="onPickLogoFile"
              >Upload Logo Image</b-button>
              <input
                type="file"
                accept="image/*"
                @change="onLogoFilePicked"
                hidden
                ref="logoFileInput"
              >
            </b-form-group>
            <b-form-group label="Main Banner Image:" class="marginTop" label-for="mainbannerurl">
              <b-form-input
                id="mainbannerurl"
                v-model="modifiedMasterInfo.mainbannerurl"
                type="text"
                placeholder="Main Banner Image URL"
              ></b-form-input>
              <b-img class="marginTop" :src="mainBannerImageUrl"></b-img>
              <b-button
                center
                variant="secondary"
                class="marginTop"
                @click="onPickMainBannerFile"
              >Upload Banner Image</b-button>
              <input
                type="file"
                accept="image/*"
                @change="onMainBannerFilePicked"
                hidden
                ref="mainBannerFileInput"
              >
            </b-form-group>
            <b-button center variant="primary" @click="addMasterInfo">Save</b-button>
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
      fields: [
        { key: 'applicationname', label: 'Application' },
        { key: 'logoimageurl', label: 'Logo Image' },
        { key: 'mainbannerurl', label: 'Main Image' },
        { key: 'promotiontext', label: 'Offer' },
        { key: 'showbrandspage', label: 'Show Brands' },
        'actions'
      ],
      showBrandsOptions: [true, false],
      logoImageUrl: '',
      logoImageFile: '',
      logoImage: '',
      mainBannerImageUrl: '',
      mainBannerImageFile: '',
      mainBannerImage: '',
      searchterm: '',
      modifiedMasterInfo: {
        applicationname: '',
        promotiontext: '',
        logoimageurl: '',
        mainbannerurl: '',
        showbrandspage: '',
        u_id: ''
      },
      showAddsection: false,
      isEdit: false
    }
  },
  computed: {
    ...mapState(['currentUser', 'masterInfos'])
  },
  methods: {
    addMasterInfo () {
      if (this.logoImageUrl && this.mainBannerImageUrl) {
        fb.storage
          .ref('master/' + this.logoImageFile.name)
          .put(this.logoImageFile)
          .then(filedata => {
            filedata.ref.getDownloadURL().then(url => {
              this.modifiedMasterInfo.logoimageurl = url
              this.logoImageUrl = ''
              this.logoImageFile = ''
              this.logoImage = ''
              fb.storage
                .ref('master/' + this.mainBannerImageFile.name)
                .put(this.mainBannerImageFile)
                .then(filedata => {
                  filedata.ref.getDownloadURL().then(url => {
                    this.modifiedMasterInfo.mainbannerurl = url
                    this.mainBannerImageUrl = ''
                    this.mainBannerImageFile = ''
                    this.mainBannerImage = ''
                    this.saveItem()
                  })
                })
            })
          })
      } else if (this.logoImageUrl) {
        fb.storage
          .ref('master/' + this.logoImageFile.name)
          .put(this.logoImageFile)
          .then(filedata => {
            filedata.ref.getDownloadURL().then(url => {
              this.modifiedMasterInfo.logoimageurl = url
              this.logoImageUrl = ''
              this.logoImageFile = ''
              this.logoImage = ''
              this.saveItem()
            })
          })
      } else if (this.mainBannerImageUrl) {
        fb.storage
          .ref('master/' + this.mainBannerImageFile.name)
          .put(this.mainBannerImageFile)
          .then(filedata => {
            filedata.ref.getDownloadURL().then(url => {
              this.modifiedMasterInfo.mainbannerurl = url
              this.mainBannerImageUrl = ''
              this.mainBannerImageFile = ''
              this.mainBannerImage = ''
              this.saveItem()
            })
          })
      } else {
        this.saveItem()
      }
    },
    saveItem () {
      if (this.isEdit) {
        fb.masterInfosCollection
          .doc(this.modifiedMasterInfo.id)
          .set(this.modifiedMasterInfo)
          .then(doc => {
            this.modifiedMasterInfo.applicationname = ''
            this.modifiedMasterInfo.promotiontext = ''
            this.modifiedMasterInfo.logoimageurl = ''
            this.modifiedMasterInfo.mainbannerurl = ''
            this.modifiedMasterInfo.showbrandspage = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        fb.masterInfosCollection
          .add({
            u_id: uuid.v1(),
            name: this.modifiedMasterInfo.applicationname,
            promotiontext: this.modifiedMasterInfo.promotiontext,
            logoimageurl: this.modifiedMasterInfo.logoimageurl,
            mainbannerurl: this.modifiedMasterInfo.mainbannerurl,
            showbrandspage: this.modifiedMasterInfo.showbrandspage
          })
          .then(doc => {
            this.modifiedMasterInfo.u_id = ''
            this.modifiedMasterInfo.applicationname = ''
            this.modifiedMasterInfo.promotiontext = ''
            this.modifiedMasterInfo.logoimageurl = ''
            this.modifiedMasterInfo.mainbannerurl = ''
            this.modifiedMasterInfo.showbrandspage = ''
            this.showAddsection = false
            this.isEdit = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    editMasterInfo (masterInfo) {
      this.isEdit = true
      this.modifiedMasterInfo = masterInfo
      this.showAddsection = true
    },
    deleteMasterInfo (id) {
      fb.masterInfosCollection
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
      this.modifiedMasterInfo = {
        applicationname: '',
        promotiontext: '',
        logoimageurl: '',
        mainbannerurl: '',
        showbrandspage: ''
      }
      this.showAddsection = false
    },
    onPickLogoFile () {
      this.$refs.logoFileInput.click()
    },
    onLogoFilePicked (event) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.logoImageUrl = fileReader.result
        this.logoImageFile = event.target.files[0]
      })
      this.logoImage = fileReader.readAsDataURL(event.target.files[0])
    },
    onPickMainBannerFile () {
      this.$refs.mainBannerFileInput.click()
    },
    onMainBannerFilePicked (event) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.mainBannerImageUrl = fileReader.result
        this.mainBannerImageFile = event.target.files[0]
      })
      this.mainBannerImage = fileReader.readAsDataURL(event.target.files[0])
    }
  }
}
</script>
