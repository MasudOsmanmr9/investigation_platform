<template>
  <div class="user-profile">
    <h1>User Profile</h1>
    <div v-if="user">
      <h2>{{ user.name }}</h2>
      <p>Email :           {{ user.email }}</p>
      <p>Role :            {{ user.role }}</p>
      <p>Contact details : {{ user.contactDetails }}</p>
      <button @click="editProfile">Edit Profile</button>
      <h3>Ratings and Reviews</h3>
      <div v-for="review in user.reviews" :key="review.id">
        <p><strong>{{ review.rating }} Stars</strong></p>
        <p>{{ review.comment }}</p>
      </div>
    </div>
    <div v-else>
      <p>Loading user profile...</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      //user: null,
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
    editProfile() {
      this.$router.push({ name: 'UpdateProfile' });
    },
  },
  created() {
    this.fetchUserProfile();
  },
};
</script>

<style scoped>
.user-profile {
  padding: 20px;
}
</style>