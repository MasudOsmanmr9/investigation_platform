<template>
  <div v-if="getRequests != null" class="view-requests">
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
  },
  methods: {
    ...mapActions(['fetchInvestigatorMyRequests','browseRequests']),
    async fetchMyRequests() {
      try {
        if(this.activeTab === 'pending') {
          const response = await this.browseRequests({
            page: this.currentPage,
            limit:this.limit
          });
        }else {
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