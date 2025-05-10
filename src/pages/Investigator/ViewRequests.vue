<template>
  <div v-if="getRequests != null" class="view-requests">
    <h1>View Requests</h1>
    <div>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'pending' }" @click="setActiveTab('pending')">brwose</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'in-progress' }" @click="setActiveTab('in-progress')">In Progress</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'completed' }" @click="setActiveTab('completed')">Completed</a>
        </li>
      </ul>
      <RequestList
        :requests="getRequests"
        @viewRequest="viewRequest"
        @pageUpdated="pageUpdateForRequests"
      />
      <Pagination
        :currentPage="getRequests.currentPage"
        :totalPages="getRequests.totalPages"
        @pageChanged="changePage"
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
    ...mapActions(['fetchInvestigatorMyRequests','browseRequests']),
    async fetchMyRequests() {
      try {
        console.log('active tab',this.activeTab)
        if(this.activeTab === 'pending') {
          const response = await this.browseRequests({
            page: this.currentPage,
            limit:this.limit
          });
        }else {
          console.log('active tabbbbbbbbbb',this.activeTab)
          const response = await this.fetchInvestigatorMyRequests({
          status: this.activeTab,
          page: this.currentPage,
          limit:this.limit
        });
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    },
    async setActiveTab(tab) {
      console.log('active tab',tab)
      this.activeTab = tab;
      this.currentPage = 1;
      // if(tab === 'pending') {
      //   await this.browseRequests();
      // } else if (tab === 'in-progress' || tab === 'completed') {
      //   await this.fetchMyRequests();
      // }
      await this.fetchMyRequests();
// Reset to first page on tab change
    },
    async changePage(page) {
      this.currentPage = page;
      console.log('page changingggggggggggggggggggg',page)
      await this.fetchMyRequests();
    },
    async pageUpdateForRequests() {
      await this.fetchMyRequests();
    },
    viewRequest(requestId) {
      this.$router.push({ name: 'RequestDetailView', params: { id: requestId } });
    },
  },
  async mounted() {
    // Fetch requests from the store or API
    await this.browseRequests({
            page: this.currentPage,
            limit:this.limit
          });
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