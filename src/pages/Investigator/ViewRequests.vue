<template>
  <div class="view-requests">
    <h1>View Requests</h1>
    <div>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'pending' }" @click="setActiveTab('pending')">Pending</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'in-progress' }" @click="setActiveTab('inProgress')">In Progress</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'completed' }" @click="setActiveTab('completed')">Completed</a>
        </li>
      </ul>
      <RequestList
        :requests="getRequests"
        @viewRequest="viewRequest"
      />
      <Pagination
        :currentPage="getRequests.currentPage"
        :totalPages="getRequests.totalPages"
        @pageChange="changePage"
      />
    </div>
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
      activeTab: 'pending',
      currentPage: 1,
      totalPages: 1,
      // filter: 'pending',
      limit:2
    };
  },
  computed: {
    // ...mapState(['requests']),
    ...mapState(['user']),
    ...mapGetters(['getRequests']),
    // filteredRequests() {
    //   console.log('filteredRequests from view rewquest',this.requests)
    //   if(this.requests === 'all') {
    //     return [];
    //   }
    //   // return this.requests.filter(request => request.status === this.activeTab);
    //   return this.requests;
    // },
    // totalPages() {
    //   return Math.ceil(this.filteredRequests.length / 10); // Assuming 10 requests per page
    // },
  },
  methods: {
    ...mapActions(['fetchRequests']),
    async fetchMyRequests() {
      try {
        const response = await this.fetchRequests({
          status: this.activeTab,
          page: this.currentPage,
          limit:this.limit
        });
        this.totalPages = response.totalPages;
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    },
    async setActiveTab(tab) {
      this.activeTab = tab;
      this.currentPage = 1; 
      await this.fetchMyRequests();// Reset to first page on tab change
    },
    async changePage(page) {
      this.currentPage = page;
      await this.fetchMyRequests();
    },
    viewRequest(requestId) {
      this.$router.push({ name: 'RequestDetailView', params: { id: requestId } });
    },
  },
  mounted() {
    // Fetch requests from the store or API
    this.$store.dispatch('fetchRequests');
  },
};
</script>

<style scoped>
.view-requests {
  padding: 20px;
}
.nav-tabs {
  margin-bottom: 20px;
}
</style>