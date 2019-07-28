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
                <form  @submit.prevent>
                    <h1>Welcome Back</h1>

                    <label for="email1">Email</label>
                    <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" />

                    <label for="password1">Password</label>
                    <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" />

                    <button @click="login" class="button">Log In</button>
                </form>
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
      fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
        this.$store.commit('setCurrentUser', user)
        this.performingRequest = false
        this.$router.push('/dashboard')
      }).catch(err => {
        console.log(err)
        this.performingRequest = false
        this.errorMsg = err.message
      })
    }
  }
}
</script>
