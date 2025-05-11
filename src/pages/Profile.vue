<template>
  <div class="profile">
    <h1>User Profile</h1>
    <form @submit.prevent="updateUserProfile">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="currentUser.name" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" disabled id="email" v-model="currentUser.email" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="contact">Contact Number</label>
        <input type="text" id="contact" v-model="currentUser.contactDetails" class="form-control" />
      </div>
      <div class="form-group">
        <label for="role">Role</label>
        <input type="text" disabled id="contact" v-model="currentUser.role" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Update Profile</button>
    </form>
 
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
import { updateUserProfile, fetchUserReviews } from '@/utils/api';

export default {
  data() {
    return {
      currentUser: {
        id: null,
        role: '',
        email: '',
        contactDetails: '',
        name: '',
      },
      reviews: []
    };
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.loadUserProfile();
    this.loadUserReviews();
  },
  methods: {
    ...mapActions(['updateProfile']),
    async loadUserProfile() {
      this.currentUser.id = this.user._id;
      this.currentUser.name = this.user.name;
      this.currentUser.email = this.user.email
      this.currentUser.contactDetails = this.user.contactDetails
      this.currentUser.role = this.user.activeRole 
    },
    async loadUserReviews() {
      // const response = await fetchUserReviews(this.currentUser.id);
      let response = {
        data: [
          { id: 1, reviewerName: 'John Doe', comment: 'Great service!', rating: 5 },
          { id: 2, reviewerName: 'Jane Smith', comment: 'Very helpful.', rating: 4 }
        ]
      };
      this.reviews = response.data || [];
    },
    async updateUserProfile() {
      let updatedUser = {
        name: this.currentUser.name,
        contactDetails: this.currentUser.contactDetails
      };
      await this.updateProfile(updatedUser);
      alert('Profile updated successfully!');
      this.$router.push('/profile');
    }
  }
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: auto;
}
.review {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}
</style>