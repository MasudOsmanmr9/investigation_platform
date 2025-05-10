<template>
  <div class="submit-report">
    <h2>Submit Investigation Report</h2>
    <form @submit.prevent="submitReport">
      <div class="form-group">
        <label for="reportTitle">Report Title</label>
        <input type="text" id="reportTitle" v-model="reportTitle" required class="form-control" />
      </div>
      <div class="form-group">
        <label for="reportDescription">Report Description</label>
        <textarea id="reportDescription" v-model="reportDescription" required class="form-control"></textarea>
      </div>
      <div class="form-group">
        <label for="reportFile">Upload Report File</label>
        <input type="file" id="reportFile" @change="handleFileUpload" required class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Submit Report</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  data() {
    return {
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
      formData.append('title', this.reportTitle);
      formData.append('description', this.reportDescription);
      formData.append('file', this.reportFile);

      try {
        await axios.post('/api/reports', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.user.token}`,
          },
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