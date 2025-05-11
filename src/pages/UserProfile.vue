<template>
  <div class="user-profile">
    <h1 class="mb-4">User Profile</h1>
    <div v-if="user">
      <h2>{{ user.name }}</h2>
      <p>Email :           {{ user.email }}</p>
      <p>Role :            {{ user.role }}</p>
      <p>Contact details : {{ user.contactDetails }}</p>
      <button @click="editProfile">Edit Profile</button>
      <h3>Ratings and Reviews</h3>
      <!-- <div v-for="review in user.reviews" :key="review.id">
        <p><strong>{{ review.rating }} Stars</strong></p>
        <p>{{ review.comment }}</p>
      </div> -->
        <div class="review-section">
          <div v-if="reviews.length > 0" class="show-review-section mt-5">
            <h3 class="mb-3">My Reviews</h3>
            <ul class="list-unstyled d-flex flex-column align-items-center">
                <li class="review-item d-flex flex-column align-items-start mb-2" v-for="review in reviews" :key="review._id">
                    <!-- <div class="d-flex flex-column align-items-start">
                        <p class="mr-2 mb-0"><strong> {{ review.requesterId.name }}</strong></p>
                        <p class="mb-0">{{ review.comment }}</p>
                    </div>
                    <div class="d-flex justify-content-start">
                        <small class="mr-2" ><strong>Rating:</strong> {{ review.rating }}</small>
                        <small><strong>Date:</strong> {{ formatDate(review.createdAt) }}</small>
                    </div> -->
                    <div class="card shadow d-flex flex-column align-items-start p-3">
                      <p class="mb-0"><strong>{{ review.requesterId.name }}:</strong> {{ review.comment }} (Rating: {{ review.rating }})</p>
                      <small><strong>Date:</strong> {{ formatDate(review.createdAt) }}</small>
                    </div>
                </li>
            </ul>
            <pagination
                :currentPage="currentPage"
                :totalPages="totalPages"
                @pageChanged="fetchReviews"
            />
          </div>
        </div>
    </div>
    <div v-else>
      <p>Loading user profile...</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Pagination from '@/components/Pagination.vue';
import { getInvestigatorReviewsApi,getUserProfileApi,createReviewApi } from '@/utils/api';
  
export default {
  components: {
        Pagination,
    },
  data() {
    return {
      reviews: [],
      currentPage: 1,
      totalPages: 1,
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    fetchUserProfile() {
      // Fetch user profile from API
      // this.$axios.get(`/api/users/${this.$route.params.id}`)
      //   .then(response => {
      //     this.user = response.data;
      //   })
      //   .catch(error => {
      //     console.error("Error fetching user profile:", error);
      //   });
    },
    async fetchReviews(page = 1) {
      try {
        const response = await getInvestigatorReviewsApi(this.user._id, page);
        this.reviews = response.data.reviews;
        this.totalPages = response.data.totalPages;
        this.currentPage = page;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
      },
    editProfile() {
      this.$router.push({ name: 'UpdateProfile' });
    },
  },
  async created() {
    await this.fetchUserProfile();
    await this.fetchReviews(1);
  },
};
</script>

<style scoped>
.user-profile {
  padding: 20px;
}
</style>