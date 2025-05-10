<template>
  <div v-if="getRequests != null" class="my-request-list">
    <h1>My Requests</h1>
    <div>
      <label for="filter">Filter by Status:</label>
      <select v-model="filter" @change="statusChange">
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
    <RequestList :requests="getRequests" @viewRequest="viewRequest"  />
    <Pagination :currentPage="getRequests.currentPage" :totalPages="getRequests.totalPages" />
  </div>
</template>

<script>
import RequestList from '@/components/RequestList.vue';
import Pagination from '@/components/Pagination.vue';
import { mapState,mapActions,mapGetters } from 'vuex';

export default {
  components: {
    RequestList,
    Pagination,
  },
  data() {
    return {
      requests: [],
      currentPage: 1,
      totalPages: 1,
      filter: 'pending',
      limit:2
    };
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['getRequests']),
  },
  methods: {
    ...mapActions(['fetchRequests']),
    async fetchMyRequests() {
      try {
        const response = await this.fetchRequests({
          status: this.filter,
          page: this.currentPage,
          limit:this.limit
        });
        this.totalPages = response.totalPages;
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    },
    async statusChange(status) {
      //this.filter = status;
      this.currentPage = 1; // Reset to first page on filter change
      await this.fetchMyRequests();
    },
    async pageChange(page) {
      this.currentPage = page;
      await this.fetchMyRequests();
    },
    viewRequest(requestId) {
      this.$router.push({ name: 'RequestDetailView', params: { id: requestId } });
    },
  },
  mounted() {
    this.fetchRequests();
  },
};
</script>

<style scoped>
.my-request-list {
  padding: 20px;
}
</style>