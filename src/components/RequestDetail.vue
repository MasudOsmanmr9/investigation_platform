<template>
    <div class="request-detail">
      <div v-if="request">
        <div v-if="request.requesterId" class="requester d-flex ">
            <div class="requester-detail d-flex flex-column align-items-start">
              <h4><strong>Requester:</strong> {{ request.requesterId.name }}</h4>
              <h5><strong>contact details:</strong> {{ request.requesterId.contactDetails }}</h5>
            </div>
            <div class="px-2" v-if="isInvestigator"><router-link class="btn btn-primary btn-sm px-4" :to="{ name: 'chatRoom', params: { id: request.requesterId._id } }">chat</router-link></div>
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
            <div v-if="request.requesterId" class="requester d-flex ">
              <div  class="requester d-flex flex-column align-items-start">
                <h4><strong>Investigator:</strong> <router-link :to="{ name: 'InvestigatorUserProfile', params: { id: request.assignedInvestigatorId._id } }">{{ request.assignedInvestigatorId.name }}</router-link></h4>
                <h5><strong>contact details:</strong> {{ request.assignedInvestigatorId.contactDetails }}</h5>
              </div>
              <div class="px-2" v-if="isRequester"><router-link class="btn btn-primary btn-sm px-4" :to="{ name: 'chatRoom', params: { id: request.assignedInvestigatorId._id } }">chat</router-link></div>
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
            <div  class="investigator d-flex flex-column align-items-start">
              <h4><strong>Investigator:</strong> {{ request.assignedInvestigatorId.name }}</h4>
              <h5><strong>contact details:</strong> {{ request.assignedInvestigatorId.contactDetails }}</h5>
            </div>
            <h4>Actions</h4>
            <!-- <div v-if="request.status === 'in-progress'"> -->
            <div v-if="request.status === 'in-progress'">
              <router-link :to="{ name: 'SubmitReport', params: { requestId: request.id } }">Submit Report</router-link>
            </div>
          </div>
          <div v-else>
            <h4 >No investigator assigned yet, wanna accept it?</h4>
            <button @click="requestAccept(request._id)" class="btn btn-success">Accept</button>
          </div>
          <div>

            <div v-if="request.report">
              <p><strong>Report:</strong> {{ request.report.reportData }}</p>
              <button v-if="request.report.file && request.status === 'completed'" class="btn btn-success" @click="handleDownloadReport">Download Report</button>
            </div>
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
    ...mapActions(['fetchSingleRequest','investigatorRequestAccept']),
    async fetchRequestDetails() {
      try {
        const response = await this.fetchSingleRequest(this.request._id);
        this.request = response.request;
        // console.log('fetching updated Request details:', this.request);
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
    async requestAccept(requestId) {
      await this.investigatorRequestAccept(requestId)
      await this.fetchRequestDetails();
    },
  },
  mounted() {
    //this.fetchRequestDetails();
  }
};
</script>

<style scoped>
.request-detail {
  padding: 20px;
}
</style>