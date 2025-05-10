<template>
  <div v-if="request" class="request-detail-view">
    <h2>Requestr Request Details</h2>
    <RequestDetail :requestData="request" v-if="request" />
    
    <div v-if="role === 'requester'">
      <h4>Tracking Status</h4>
      <p>Status: {{ request.status }}</p>
      <div v-if="request.report">
        <h4>Investigator's Report</h4>
        <p v-if="request.report.reportData">{{ request.report.reportData }}</p>
        <button v-if="request.report.file" class="btn btn-success" @click="handleDownloadReport">Download Report</button>
        
      </div>
    </div>

    <div v-if="role === 'investigator'">
      <h3>Investigator Actions</h3>
      <p>Request Status: {{ request.status }}</p>
      <router-link :to="{ name: 'SubmitReport', params: { requestId: request.id } }">Submit Report</router-link>
    </div>
  </div>
</template>

<script>
import RequestDetail from '@/components/RequestDetail.vue';
import { mapState,mapActions } from 'vuex';
import { downloadReport } from '../../utils/api';
import axios from 'axios';

export default {
  components: {
    RequestDetail,
  },
  data() {
    return {
      requestId: this.$route.params.id,
      request: null,
      role: this.$store.state.user.activeRole,
    };
  },
  async created() {
    await this.fetchRequestDetails();
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapActions(['fetchSingleRequest']),
    async fetchRequestDetails() {
      try {
        const response = await this.fetchSingleRequest(this.requestId);
        console.log('Request Detail:', response.request);
        this.request = response.request;
      } catch (error) {
        console.error('Error fetching request detail:', error);
      }
    },

    async handleDownloadReport() {
      try {
        await downloadReport(this.request._id); // Pass the request ID to downloadReport
      } catch (error) {
        console.error('Error downloading report:', error);
      }
    },

  },

  // async mounted() {
  //   await this.fetchRequestDetails();
  // }
};
</script>

<style scoped>
.request-detail-view {
  padding: 20px;
}
</style>