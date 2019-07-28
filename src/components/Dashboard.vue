<template>
    <div id="dashboard">
        <section>
            <div v-if="users.length">
    <div v-for="user in users" :key="user.u_id" class="post">
        {{ user.u_id }}
        {{ user.user }}
        {{ user.password }}
        
    </div>
</div>
<div v-else>
    <p class="no-results">There are currently no posts</p>
</div>
        </section>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
const fb = require('../firebaseConfig.js')
export default {
  data () {
    return {
      post: {
        content: ''
      },
      comment: {
        postId: '',
        userId: '',
        content: '',
        postComments: 0
      },
      showCommentModal: false,
      showPostModal: false,
      fullPost: {},
      postComments: []
    }
  },
  computed: {
    ...mapState(['currentUser', 'users'])
  },
}
</script>
