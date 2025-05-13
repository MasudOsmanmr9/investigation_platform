<template>
    <div class="investigator-profile">
        <h2>Investigator Profile</h2>
        <div v-if="investigatorInfo">
            <p><strong>Name:</strong> {{ investigatorInfo.name }}</p>
            <p><strong>Email:</strong> {{ investigatorInfo.email }}</p>
            <p><strong>Contact Details:</strong> {{ investigatorInfo.contactDetails }}</p>
        </div>
        <!-- Form to Leave a Comment -->
        <h3>Leave a Review</h3>
        <form @submit.prevent="submitReview">
        <div class="form-group">
            <label for="rating">Rating (1-5):</label>
            <input
            type="number"
            id="rating"
            v-model="rating"
            min="1"
            max="5"
            required
            class="form-control"
            />
        </div>
        <div class="form-group">
            <label for="comment">Comment:</label>
            <textarea
            id="comment"
            v-model="comment"
            required
            class="form-control"
            ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit Review</button>
        </form>

        <div v-if="reviews.length > 0" class="show-review-section mt-5">
            <h3 class="mb-3">My Reviews</h3>
            <ul class="list-unstyled d-flex flex-column align-items-center">
                <li class="review-item d-flex flex-column align-items-start mb-2" v-for="review in reviews" :key="review._id">
                    <div class="d-flex flex-column align-items-start">
                        <p class="mr-2 mb-0"><strong> {{ review.requesterId.name }}</strong></p>
                        <p class="mb-0">{{ review.comment }}</p>
                    </div>
                    <div class="d-flex justify-content-start">
                        <small class="mr-2" ><strong>Rating:</strong> {{ review.rating }}</small>
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
        <div v-else>
            <p>No reviews available.</p>
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
        investigatorId: this.$route.params.id,
        investigatorInfo: null,
        rating: null,
        comment: '',
        reviews: [],
        currentPage: 1,
        totalPages: 1,
      };
    },
    computed: {
      ...mapState(['user','activeRole']),
    },
    methods: {
    async fetchInvestigatorInfo() {
      try {
        //const investigatorId = this.$route.params.id; // Get investigator ID from route params
        const response = await getUserProfileApi(this.investigatorId); // Fetch investigator's profile
        this.investigatorInfo = response.data.user;
      } catch (error) {
        console.error('Error fetching investigator info:', error);
      }
    },
      async fetchReviews(page = 1) {
        try {
          const response = await getInvestigatorReviewsApi(this.investigatorId, page);
          this.reviews = response.data.reviews;
          this.totalPages = response.data.totalPages;
          this.currentPage = page;
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      },
      async submitReview() {
            try {
            const payload = {
                investigatorId: this.investigatorId, // Assuming the investigator's ID is the logged-in user's ID
                rating: this.rating,
                comment: this.comment,
            };
            await createReviewApi(payload); // Call the API to create a review
            this.$toast.success('Review submitted successfully!'); // Show success message
            this.rating = null; 
            this.comment = ''; 
            this.fetchReviews(); // Refresh the reviews list
            } catch (error) {
            console.error('Error submitting review:', error);
            }
        },
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
      },
      async fetchInfoInit() {
 // Get investigator ID from route params
        await this.fetchInvestigatorInfo(this.investigatorId); 
        //this.investigatorInfo = response.data.user; // Fetch investigator's profile
        let reviewResponse = await this.fetchReviews(1); // Fetch investigator's profile
        // this.reviews = reviewResponse.data.reviews;
        // this.totalPages = reviewResponse.data.totalPages;
        // this.currentPage = 1; // Fetch investigator's profile
    },
    },
    async mounted() {
        await this.fetchInfoInit();
    },
  };
  </script>