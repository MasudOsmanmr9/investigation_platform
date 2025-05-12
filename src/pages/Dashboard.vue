<template>
  <div class="dashboard container mt-4">
    <h2 class="mb-4">Dashboard</h2>

    <!-- Role-Based Counts -->
    <div class="row">
      <!-- Investigator Counts -->
      <div v-if="activeRole == 'investigator' && investigatorCounts" class="investigator d-flex">
        <div class="col-md-3 mb-4">
          <div class="card shadow text-center">
            <div class="card-body">
              <h5 class="card-title">Available Requests</h5>
              <p class="card-text">{{ investigatorCounts.available }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="card shadow text-center">
            <div class="card-body">
              <h5 class="card-title">In Progress</h5>
              <p class="card-text">{{ investigatorCounts.inProgress }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="card shadow text-center">
            <div class="card-body">
              <h5 class="card-title">Completed</h5>
              <p class="card-text">{{ investigatorCounts.completed }}</p>
            </div>
          </div>
        </div>
      <div  class="col-md-3 mb-4">
        <div class="card shadow text-center">
          <div class="card-body">
            <h5 class="card-title">Reviews</h5>
            <p class="card-text">{{ investigatorCounts.reviews }}</p>
          </div>
        </div>
      </div>
      </div>

      <!-- Requester Counts -->
      <!-- <div v-if="activeRole === 'requester'" class="requester d-flex">
        <div v-if="userRole === 'requester' || userRole === 'both'" class="col-md-3 mb-4">
        <div class="card shadow text-center">
          <div class="card-body">
            <h5 class="card-title">Pending</h5>
            <p class="card-text">{{ requesterCounts.pending }}</p>
          </div>
        </div>
      </div>
      <div v-if="userRole === 'requester' || userRole === 'both'" class="col-md-3 mb-4">
        <div class="card shadow text-center">
          <div class="card-body">
            <h5 class="card-title">In Progress</h5>
            <p class="card-text">{{ requesterCounts.inProgress }}</p>
          </div>
        </div>
      </div>
      <div v-if="userRole === 'requester' || userRole === 'both'" class="col-md-3 mb-4">
        <div class="card shadow text-center">
          <div class="card-body">
            <h5 class="card-title">Completed</h5>
            <p class="card-text">{{ requesterCounts.completed }}</p>
          </div>
        </div>
      </div>
      </div> -->
      <div v-if="activeRole === 'requester' && requesterCounts" class="requester d-flex">
      <div  class="col-md-3 mb-4">
        <div class="card shadow text-center">
          <div class="card-body">
            <h5 class="card-title">Pending</h5>
            <p class="card-text">{{ requesterCounts.pending }}</p>
          </div>
        </div>
      </div>
      <div  class="col-md-3 mb-4">
        <div class="card shadow text-center">
          <div class="card-body">
            <h5 class="card-title">In Progress</h5>
            <p class="card-text">{{ requesterCounts.inProgress }}</p>
          </div>
        </div>
      </div>
      <div  class="col-md-3 mb-4">
        <div class="card shadow text-center">
          <div class="card-body">
            <h5 class="card-title">Completed</h5>
            <p class="card-text">{{ requesterCounts.completed }}</p>
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Activities -->
    <div class="row">
      <div v-if="userRole === 'requester' || userRole === 'both'" class="col-6 mt-4">
      <h3>Requester Activities</h3>
      <ul class="list-group">
        <li v-for="activity in requesterActivities" :key="activity._id" class="list-group-item">
          <p><strong>Area:</strong> {{ activity.area }}</p>
          <p><strong>Description:</strong> {{ activity.description }}</p>
          <p><strong>Status:</strong> {{ activity.status }}</p>
        </li>
      </ul>
    </div>

    <div v-if="userRole === 'investigator' || userRole === 'both'" class="col-6 mt-4">
      <h3>Investigator Activities</h3>
      <ul class="list-group">
        <li v-for="activity in investigatorActivities" :key="activity._id" class="list-group-item">
          <p><strong>Area:</strong> {{ activity.area }}</p>
          <p><strong>Description:</strong> {{ activity.description }}</p>
          <p><strong>Status:</strong> {{ activity.status }}</p>
        </li>
      </ul>
    </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/app-navbar.vue';
import MyRequestList from '@/pages/Requester/MyRequestList.vue';
import ViewRequests from '@/pages/Investigator/ViewRequests.vue';
import { fetchDashboardDataApi } from '@/utils/api'; // Adjust the import path as needed
import { mapState,mapActions } from 'vuex';

export default {
  components: {
    Navbar,
    MyRequestList,
    ViewRequests,
  },
  data() {
    return {
      investigatorCounts: null,
      requesterCounts: null,
      requesterActivities: null,
      investigatorActivities: null,
      availableRequests: null,
      reviews: null,
      userRole: null,
    };
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
    async fetchDashboardData() {
      try {
        const response = await fetchDashboardDataApi(this.user._id);
        this.investigatorCounts = response.data.dashboardData?.investigatorCountActivities?.counts;
        this.requesterCounts = response.data.dashboardData?.requesterCountActivities?.counts;
        this.requesterActivities = response.data.dashboardData?.requesterActivities;
        this.investigatorActivities = response.data.dashboardData?.investigatorActivities;
        this.availableRequests = response.data.dashboardData?.investigatorActivities;
        this.reviews = response.data.dashboardData?.reviews;
        this.userRole = this.user.role; // Assuming role is stored in Vuex
      } catch (error) {
        this.$toast.error(error,{
          duration: 3000,
          // all of other options may go here
      });
        console.error('Error fetching dashboard data:', error);
      }
    }
  },
  mounted() {
    this.fetchDashboardData();
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