<template>
  <div class="auth-container  mt-5">
    <h2>Sign In</h2>
    <!-- <form class="d-flex flex-column g-3" @submit.prevent="handleSignIn">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit" class="btn btn-primary">Sign In</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form> -->
    <form class="d-flex flex-column  g-3" @submit.prevent="handleSignIn">
      <div class="col-md-12 d-flex flex-column align-items-start">
        <label for="email" class="form-label">Email</label>
        <input type="email" v-model="email" class="form-control" id="email" required>
      </div>
      <div class="col-md-12 d-flex flex-column align-items-start mt-2">
        <label for="password" class="form-label">Password</label>
        <input type="password" v-model="password" class="form-control" id="password" required>
      </div>
      <button type="submit" class="btn btn-primary mt-4">Sign In</button>
      <!-- <p v-if="errorMessage" class="error">{{ errorMessage }}</p> -->
    </form>
    <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['signIn']),
    async handleSignIn() {
      try {
        // console.log('this.signIn',this.signIn)
        await this.signIn({ email: this.email, password: this.password });
        this.$router.push('/dashboard');
      } catch (error) {
        this.errorMessage = error;
        this.$toast.error(error,{
          duration: 3000,
          // all of other options may go here
      });
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.error {
  color: red;
}
</style>