<template>
  <div class="marginTop">
    <b-container v-if="!showEditPermissionsSection">
      <b-form-input type="text" v-model="searchterm" placeholder="Search users"></b-form-input>
      <span hidden>{{userpermissions}}</span>
      <b-table
        borderless
        outlined
        hover
        class="marginTop"
        v-if="filteredUsers.length"
        :items="filteredUsers"
        :fields="fields"
      >
        <template slot="userpermission" slot-scope="data">
          <span v-if="data.item.userpermission">
            <b-badge v-if="data.item.userpermission.read">Read: {{data.item.userpermission.read}}</b-badge>
            <b-badge v-if="data.item.userpermission.write">Write: {{data.item.userpermission.write}}</b-badge>
            <b-badge v-if="!data.item.userpermission.read">Read: false</b-badge>
            <b-badge v-if="!data.item.userpermission.write">Write: fasle</b-badge>
          </span>
          <span v-if="!data.item.userpermission">
            <b-badge>Read: false</b-badge>
            <b-badge>Write: false</b-badge>
          </span>
        </template>
        <template slot="actions" slot-scope="data">
          <b-button
            variant="outline-primary"
            @click="modifyUserpermissions(data.item)"
          >Edit Permissions</b-button>
        </template>
      </b-table>

      <div v-else>
        <p class="no-results">There are currently no users</p>
      </div>
    </b-container>
    <transition name="fade">
      <div v-if="showEditPermissionsSection" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal" class="close">X</a>
          <b-form class="post">
            Permissions for {{modifiedUserpermissions.name}}
            <b-form-group label="Read:" label-for="read">
              <b-form-select
                id="read"
                required
                placeholder="Read"
                v-model="modifiedUserpermissions.read"
                :options="permissionOptions"
              ></b-form-select>
            </b-form-group>
            <b-form-group label="Write:" label-for="write">
              <b-form-select
                id="write"
                required
                placeholder="Write"
                v-model="modifiedUserpermissions.write"
                :options="permissionOptions"
              ></b-form-select>
            </b-form-group>
            <b-button center variant="secondary" class="marginTop" @click="addUserPermissions">Save</b-button>
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
      permissionOptions: [true, false],
      fields: ['name', 'userpermission', 'actions'],
      searchterm: '',
      modifiedUserpermissions: {
        id: '',
        name: '',
        read: '',
        write: ''
      },
      showEditPermissionsSection: false,
      isEdit: false
    }
  },
  computed: {
    ...mapState(['currentUser', 'users', 'userpermissions']),
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
    addUserPermissions () {
      fb.userpermissionsCollection
        .doc(this.modifiedUserpermissions.id)
        .set({
          read: this.modifiedUserpermissions.read,
          write: this.modifiedUserpermissions.write
        })
        .then(doc => {
          this.modifiedUserpermissions.id = ''
          this.modifiedUserpermissions.name = ''
          this.modifiedUserpermissions.read = ''
          this.modifiedUserpermissions.write = ''
          this.showEditPermissionsSection = false
          this.isEdit = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    modifyUserpermissions (user) {
      this.modifiedUserpermissions.id = user.id
      this.modifiedUserpermissions.name = user.name
      this.showEditPermissionsSection = true
      if (user.userpermission) {
        this.isEdit = true
        if (user.userpermission.read) {
          this.modifiedUserpermissions.read = user.userpermission.read
        } else {
          this.modifiedUserpermissions.read = false
        }
        if (user.userpermission.read) {
          this.modifiedUserpermissions.write = user.userpermission.write
        } else {
          this.modifiedUserpermissions.write = false
        }
      } else {
        this.isEdit = false
        this.modifiedUserpermissions.read = false
        this.modifiedUserpermissions.write = false
      }
    },
    closePostModal () {
      this.showEditPermissionsSection = false
    }
  }
}
</script>
