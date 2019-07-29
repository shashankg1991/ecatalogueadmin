<template>
  <div id="login">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div class="col1">
        <h1>eCatalogue Admin</h1>
      </div>
      <div class="col2">
        <b-form @submit.prevent>
          <h1>Welcome Back</h1>
          <b-form-group label="Email:" label-for="email1">
            <b-form-input
              id="email1"
              v-model="loginForm.email"
              type="text"
              required
              placeholder="you@email.com"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Password:" label-for="password1">
            <b-form-input
              id="password1"
              v-model="loginForm.password"
              type="password"
              required
              placeholder="******"
            ></b-form-input>
          </b-form-group>

          <b-button center variant="outline-primary" @click="login" class="button">Log In</b-button>
        </b-form>
        <transition name="fade">
          <div v-if="errorMsg !== ''" class="error-msg">
            <p>{{ errorMsg }}</p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require('../firebaseConfig.js')
export default {
  data () {
    return {
      performingRequest: false,
      loginForm: {
        email: '',
        password: ''
      },
      showLoginForm: true,
      errorMsg: ''
    }
  },
  methods: {
    toggleForm () {
      this.errorMsg = ''
      this.showLoginForm = !this.showLoginForm
    },
    login () {
      this.performingRequest = true
      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          this.$store.commit('setCurrentUser', user)
          this.performingRequest = false
          this.$router.push('/home')
        })
        .catch(err => {
          console.log(err)
          this.performingRequest = false
          this.errorMsg = err.message
        })
    }
  }
}
</script>
