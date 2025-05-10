<template>
  <div class="request-detail-view">
    <h2>investigatorRequest Detail</h2>
    <RequestDetail :requestData="request" v-if="request" />
    <div v-if="role === 'investigator'">
      <h3>Investigator Report</h3>
      <form @submit.prevent="submitReport">
        <div class="form-group">
          <label for="reportData">Report Data</label>
          <textarea id="reportData" v-model="reportData" class="form-control" required></textarea>
        </div>
        <div class="form-group">
          <label for="reportFile">Upload Report File</label>
          <input type="file" @change="handleFileUpload" class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary">Submit Report</button>
      </form>
    </div>
    <div v-if="role === 'requester' && request.report">
      <h3>Investigator's Report</h3>
      <p>{{ request.report.data }}</p>
      <a :href="request.report.fileUrl" class="btn btn-success" download>Download Report</a>
    </div>
  </div>
</template>

<script>
import RequestDetail from '@/components/RequestDetail.vue';
import { mapState,mapActions } from 'vuex';
import axios from 'axios';

export default {
  components: {
    RequestDetail,
  },
  data() {
    return {
      requestId: this.$route.params.id,
      request: null,
      reportData: '',
      reportFile: null,
    };
  },
  async created() {
    await this.fetchRequestDetails();
  },
  computed: {
    ...mapState(['user']),
    role() {
      return this.user.activeRole;
    },
  },
  methods: {
    ...mapActions(['fetchSingleRequest']),
    async fetchRequestDetails() {
      try {
        const response = await this.fetchSingleRequest(this.requestId);
        console.log(' investigator Request Detail:', response.request);
        this.request = response.request;
      } catch (error) {
        console.error('Error fetching request detail:', error);
      }
    },
    handleFileUpload(event) {
      this.reportFile = event.target.files[0];
    },
    async submitReport() {
      const formData = new FormData();
      formData.append('reportData', this.reportData);
      if (this.reportFile) {
        formData.append('reportFile', this.reportFile);
      }
      try {
        await axios.post(`/api/requests/${this.request.id}/submit-report`, formData);
        this.$router.push({ name: 'ViewRequests' });
      } catch (error) {
        console.error('Error submitting report:', error);
      }
    },
  },
};
</script>

<style scoped>
.request-detail-view {
  padding: 20px;
}
</style>