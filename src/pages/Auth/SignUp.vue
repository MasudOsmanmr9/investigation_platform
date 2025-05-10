<template>
  <div class="signup-container">
    <h2>Sign Up</h2>
    <form class="d-flex flex-column g-3" @submit.prevent="handleSignUp">
      <div class="col-md-12 d-flex flex-column align-items-start">
        <label for="email" class="form-label">Email</label>
        <input type="email" v-model="email" class="form-control" id="email" required>
      </div>
      <div class="col-md-12 d-flex flex-column align-items-start">
        <label for="password" class="form-label">Password</label>
        <input ttype="password" v-model="password" id="password" class="form-control" required>
      </div>
      <fieldset class="row my-3 my-2 px-3">
        <legend class="col-form-label col-sm-2 col-6 pt-0">Role</legend>
        <div class="col-6 d-flex flex-column align-items-start">
          <div class="form-check">
            <input class="form-check-input" type="radio" v-model="role" name="gridRadios" id="gridRadios1" value="requester">
            <label class="form-check-label" for="gridRadios1">
              requester
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" v-model="role" name="gridRadios" id="gridRadios2" value="investigator">
            <label class="form-check-label" for="gridRadios2">
              investigator
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" v-model="role" name="gridRadios" id="gridRadios3" value="both" >
            <label class="form-check-label" for="gridRadios3">
              both
            </label>
          </div>
        </div>
      </fieldset>
      <button type="submit">Sign Up</button>
    </form>
    <p>Already have an account? <router-link to="/signin">Sign In</router-link></p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      role: ''
    };
  },
  methods: {
    ...mapActions(['registerUser']),
    async handleSignUp() {
      try {
        await this.registerUser({ email: this.email, password: this.password, role: this.role });
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    }
  }
};
</script>

<style scoped>
.signup-container {
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

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>