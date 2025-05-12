<template>
  <div class="submit-report">
    <h2>Submit Investigation Report</h2>
    <form @submit.prevent="submitReport">
      <!-- <div class="form-group">
        <label for="reportTitle">Report Title</label>
        <input type="text" id="reportTitle" v-model="reportTitle" required class="form-control" />
      </div> -->
      <div class="form-group">
        <label for="reportDescription">Report Description</label>
        <textarea id="reportDescription" v-model="reportDescription" required class="form-control"></textarea>
      </div>
      <div class="form-group">
        <label for="reportFile">Upload Report File</label>
        <input type="file" id="reportFile" name="reportFile" @change="handleFileUpload" required class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Submit Report</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { uploadFileApi } from '../../utils/api.js'; // Adjust the relative path based on your file structure // Adjust the import path as necessary

export default {
  data() {
    return {
      requestId : this.$route.params.id,
      reportTitle: '',
      reportDescription: '',
      reportFile: null,
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    handleFileUpload(event) {
      this.reportFile = event.target.files[0];
    },
    async submitReport() {
      const formData = new FormData();
      // formData.append('title', this.reportTitle);
      formData.append('reportData', this.reportDescription);
      formData.append('reportFile', this.reportFile);

      try {
        // await axios.post('/api/reports', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //     Authorization: `Bearer ${this.user.token}`,
        //   },
        // });
        await uploadFileApi(formData,this.requestId);
        this.$toast.success('Report submitted successfully!', {
          duration: 3000,
        });
        this.$router.push({ name: 'Dashboard' });
      } catch (error) {
        console.error('Error submitting report:', error);
      }
    },
  },
};
</script>

<style scoped>
.submit-report {
  max-width: 600px;
  margin: auto;
}
</style>