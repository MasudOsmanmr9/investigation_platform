<template>
  <div>
    <h2>Request List</h2>
    <div v-if="getRequests.requests.length === 0">
      <p>No requests found.</p>
    </div>
    <ul class ="list-default-none">
      <li v-for="request in getRequests.requests" :key="request.id" class="request-item d-flex justify-content-center">
        <div v-if="currentActiveRole === 'requester'" class="card shadow" style="width: 50%;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ request.area }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Status: {{ request.status }}</h6>
            <p class="card-text">{{ sliceLetterFilter(request.description) }}</p>
            <router-link :to="`/requester/request-detail/${request._id}`" class="btn btn-primary">View Details</router-link>
          </div>
        </div>
        <div v-if="currentActiveRole === 'investigator'" class="card shadow" style="width: 50%;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ request.area }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Status: {{ request.status }}</h6>
            <p class="card-text">{{ sliceLetterFilter(request.description) }}</p>
            <div class="d-flex justify-content-around">
              <router-link :to="`/investigator/request-detail/${request._id}`" class="btn btn-primary">View Details</router-link>
              <button @click="requestAccept(request._id)" class="btn btn-success">Accept</button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue';
import axios from 'axios';
import { mapState,mapActions,mapGetters } from 'vuex';
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      requests: [],
      currentPage: 1,
      totalPages: 1,
    };
  },
  computed: {
    ...mapState(['user','activeRole']),
    ...mapGetters(['getRequests']),
    currentActiveRole() {
      return this.activeRole;
    },
  },
  methods: {
    async fetchRequests() {
      try {
        this.requests = this.getRequests.requests;
        this.totalPages = this.getRequests.totalPages;
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    },
    sliceLetterFilter (value) {
      console.log('valueeeeeeeeeee',value)
      if (!value) return ''
      value = value.toString()
      return  value.slice(1,50) + '...'
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchRequests();
    },
    requestAccept(requestId) {
      console.log('Request accepted:', requestId);
    },
  },
  mounted() {
    this.fetchRequests();
  },
};
</script>

<style scoped>
.list-default-none {
  list-style-type: none;
  padding: 0;
}
.request-item {
  margin-bottom: 20px;
}
</style>