<template>
  <div class="dashboard">
    <!-- <Navbar /> -->
    <div class="container">
      <h1>Dashboard</h1>
      {{ `Active Role: ${currentActiveRole}` }}
      <div class="role-switch">
        <button @click="switchUserRole('requester')" v-if="isBothRoles">Switch to Requester</button>
        <button @click="switchUserRole('investigator')" v-if="isBothRoles">Switch to Investigator</button>
      </div>
      <div v-if="currentActiveRole === 'requester'">
        <h2>Your Requests</h2>
        <MyRequestList />
      </div>
      <div v-else-if="currentActiveRole === 'investigator'">
        <h2>Available Requests</h2>
        <ViewRequests />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/app-navbar.vue';
import MyRequestList from '@/pages/Requester/MyRequestList.vue';
import ViewRequests from '@/pages/Investigator/ViewRequests.vue';
import { mapState,mapActions } from 'vuex';

export default {
  components: {
    Navbar,
    MyRequestList,
    ViewRequests,
  },
  computed: {
    ...mapState(['user','activeRole']),
    currentActiveRole() {
      return this.activeRole;
    },
    isBothRoles() {
      // console.log('isBothRoles', this.user.role)
      return this.user && this.user.role === 'both' 
      //return true
      //&& this.user.roles.includes('investigator');
    },
  },
  created() {

  },
  methods: {
    ...mapActions(['switchRole']),
    async switchUserRole(role) {
      // this.$store.commit('setActiveRole', role);
      
      await this.switchRole(role);
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.role-switch {
  margin-bottom: 20px;
}
</style>