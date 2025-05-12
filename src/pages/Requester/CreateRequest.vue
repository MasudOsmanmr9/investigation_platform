<template>
  <div class="create-request">
    <h2>Create Investigation Request</h2>
    <form @submit.prevent="submitRequest">
      <div class="form-group">
        <label for="city">City/State:</label>
        <input type="text" v-model="request.area" id="city" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea v-model="request.description" id="description" class="form-control" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit Request</button>
    </form>
    <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState,mapActions } from 'vuex';

export default {
  data() {
    return {
      request: {
        area: '',
        description: ''
      },
      message: ''
    };
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['createRequest']),
    async submitRequest() {
      try {
        const response = await this.createRequest({
          ...this.request,
          //requesterId: this.user.id
        });
        this.message = 'Request submitted successfully!';
        this.request.area = '';
        this.request.description = '';
        this.$toast.success(this.message, {
          duration: 3000,
        });
        this.$router.push('/requester/my-requests');
      } catch (error) {
        console.log('Error submitting request:', error);
        this.message = 'Error submitting request. Please try again.';
      }
    }
  }
};
</script>

<style scoped>
.create-request {
  max-width: 600px;
  margin: auto;
}
</style>