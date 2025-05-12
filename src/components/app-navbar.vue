<template>
  <nav v-if="isAuthenticated" class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Investigation Platform</a>
    <!-- <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button> -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <!-- <div class="collapse navbar-collapse" id="navbarNav"> -->
    <div class="collapse navbar-collapse d-flex justify-content-end" id="navbarTogglerDemo02">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
        </li>
        <li class="nav-item" v-if="isRequester">
          <router-link class="nav-link" to="/requester/create">create Requests</router-link>
        </li>
        <li class="nav-item" v-if="isRequester">
          <router-link class="nav-link" to="/requester/my-requests">My Requests</router-link>
        </li>
        <li class="nav-item" v-if="isInvestigator">
          <router-link class="nav-link" to="/investigator/view-requests">View Requests</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/profile">Profile</router-link>
        </li>
        <li class="nav-item d-flex flex-cloumn align-items-center" v-if="user.role == 'both'">
          <!-- <div class="d-flex flex-column">
            <p class="active-roll">Active Role: {{ user.activeRole }}</p>
            <button class="btn btn-link nav-link" @click="switchRole">Switch Role</button>
          </div> -->
          <p class="active-roll my-0 mx-2"><strong>Active Role: {{ user.activeRole }}</strong></p>
          <div class="form-check form-switch d-flex flex-column">
            <input class="form-check-input" @change="switchUserRole" type="checkbox" id="flexSwitchCheckChecked" checked>
            <label class="form-check-label" for="flexSwitchCheckChecked">{{ user.activeRole == 'requester' ? 'Switch to Investigator' : 'Switch to Requester' }}</label>
          </div>
        </li>
        <li class="nav-item">
          <button class="btn btn-link nav-link" @click="logout">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapState,mapActions } from 'vuex';
export default {
  computed: {
    ...mapState(['user','activeRole','isAuthenticated']),
    // user() {
    //   return this.$store.state.user; // Safely access the user object
    // },
    isRequester() {
      return this.activeRole === 'requester';
    },
    isInvestigator() {
      return this.activeRole === 'investigator';
    }
  },
  methods: {
    ...mapActions(['switchRole']),
    // switchRole() {
    //   this.$store.dispatch('switchRole');
    // },
    async switchUserRole(role) {
      try {
        console.log('Role switched acccesssssing:')      
        let propsedrole = this.activeRole === 'requester' ? 'investigator' : 'requester';
        console.log('Role switched 0:', propsedrole);
        await this.switchRole(propsedrole);
        console.log('Role switched 1:', propsedrole);
        this.$router.push('/dashboard');
        console.log('Role switched successfully:', propsedrole);
      } catch (error) {
        console.log('Error switching roleeeeeeeeeeeeee:', error);
        this.$toast.error(error,{
            duration: 3000,
            // all of other options may go here
        });
        console.error('Error switching role:', error);
      }
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/signin');
    }
  }
};
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}
</style>