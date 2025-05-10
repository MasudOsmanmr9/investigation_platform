<template>
    <div class="request-detail">
      <div v-if="request">
        <div v-if="request.requesterId" class="requester d-flex flex-column align-items-start">
          <h4><strong>Requester:</strong> {{ request.requesterId.name }}</h4>
          <h5><strong>contact details:</strong> {{ request.requesterId.contactDetails }}</h5>
        </div>
        <div class="d-flex flex-column align-items-start mt-2">
          <p><strong>Area:</strong>{{ request.area }}</p>
          <p><strong>Description:</strong> {{ request.description }}</p>
          <p><strong>Status:</strong> {{ request.status }}</p>
          <p><strong>Created On:</strong> {{ formatDate(request.createdAt) }}</p>
        </div>

        <div class="mt-4" v-if="isRequester">
          <div v-if="request.assignedInvestigatorId">
            <h4>Investigator</h4>
            <div  class="requester d-flex flex-column align-items-start">
              <h4><strong>Investigator:</strong> {{ request.assignedInvestigatorId.name }}</h4>
              <h5><strong>contact details:</strong> {{ request.assignedInvestigatorId.contactDetails }}</h5>
            </div>
          <!-- <p v-if="request.report">{{ request.report }}</p> -->
          <!-- <button v-if="request.reportFile" @click="downloadReport">Download Report</button> -->
          </div>
          <div v-else>
            <h4 >Investigator's will look forward soon!!</h4>
            <p>No report available yet.</p>
          </div>
        </div>

        <div v-if="isInvestigator">
          <div v-if="request.assignedInvestigatorId">
            <h4>Investigator</h4>
            <div  class="requester d-flex flex-column align-items-start">
              <h4><strong>Investigator:</strong> {{ request.assignedInvestigatorId.name }}</h4>
              <h5><strong>contact details:</strong> {{ request.assignedInvestigatorId.contactDetails }}</h5>
            </div>
            <h4>Actions</h4>
            <!-- <div v-if="request.status === 'in-progress'"> -->
            <div>
              <router-link :to="{ name: 'SubmitReport', params: { requestId: request.id } }">Submit Report</router-link>
            </div>
            <div v-if="request.status === 'completed'">
              <button v-if="request.report.file" class="btn btn-success" @click="handleDownloadReport">Download Report</button>
        
            </div>
          </div>
          <div v-else>
            <h4 >No investigator assigned yet, wanna accept it?</h4>
            <button @click="requestAccept(request._id)" class="btn btn-success">Accept</button>
        </div>
        </div>
        <div v-else>
          <p>Loading request details...</p>
        </div>
      </div>
    </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
import { downloadReport } from '../utils/api';
// import { downloadReport } from '../../utils/api';

export default {
  props: {
    requestData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      request: this.requestData
    };
  },
  computed: {
    ...mapState(['user','activeRole']),
    isRequester() {
      return this.activeRole === 'requester';
    },
    isInvestigator() {
      return this.activeRole === 'investigator';
    }
  },
  methods: {
    ...mapActions(['fetchSingleRequest']),
    async fetchRequestDetails() {
      try {
        // const response = await this.fetchSingleRequest(this.requestId);
        // this.request = response.data;
      } catch (error) {
        console.error('Error fetching request details:', error);
      }
    },
    formatDate (dateString){
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'short', day: '2-digit' }; // Format: May 07 2025
      return date.toLocaleDateString('en-US', options);
    },
    async handleDownloadReport() {
      try {
        await downloadReport(this.request._id); // Pass the request ID to downloadReport
      } catch (error) {
        console.error('Error downloading report:', error);
      }
    },
    requestAccept(requestId) {
      console.log('Request accepted:', requestId);
    },
  },
  mounted() {
    console.log('child request detail', this.requestData);
    //this.fetchRequestDetails();
  }
};
</script>

<style scoped>
.request-detail {
  padding: 20px;
}
</style>