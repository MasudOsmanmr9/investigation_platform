import { createStore } from 'vuex';
import axios from 'axios';
import { 
  signUpApi,
  signInApi,
  createRequest,
  fetchMyRequests,
  fetchRequestDetails,
  updateUserProfile,
  switchUserRole,
  browseRequests,
  investigatorMyRequests,
  investigatorAcceptRequest
} from '@/utils/api';
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    // user: {
    //   id: null,
    //   name: 'masud osman',
    //   email: 'masud@gmail.com',
    //   roles: 'both',
    //   activeRole: 'requester'
    // },
    user: null,
    isAuthenticated: false,
    token: null,
    activeRole: null,
    requests: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token); // Save token in localStorage
      } else {
        localStorage.removeItem('token'); // Remove token from localStorage
      }
    },
    SET_ACTIVE_ROLE(state, role) {
      console.log('Setting active role:', role);
      state.activeRole = role;
    },
    SET_REQUESTS(state, requests) {
      state.requests = requests;
    },
    ADD_REQUEST(state, request) {
      state.requests.requests.push(request);
    },
    UPDATE_REQUEST(state, updatedRequest) {
      const index = state.requests.findIndex(request => request.id === updatedRequest.id);
      if (index !== -1) {
        state.requests.splice(index, 1, updatedRequest); // Replace the request
      }
    },
  },
  actions: {
    login({ commit }, user) {
      commit('SET_USER', user);
    },
    async fetchRequests({ commit,state },payload = { page : 1, limit : 2, status : 'pending' }) {
      try {
        let { page, limit, status} = payload;
        const response = await fetchMyRequests({ status, page, limit });
        console.log('Fetched Requests store updatedddd:', response.data);
        commit('SET_REQUESTS', response.data);
        return response.data; // Return the data for the component
      } catch (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
    },
    async browseRequests({ commit }, payload = { page : 1, limit : 2}) {
      try {
        let { page, limit} = payload;
        const response = await browseRequests({ page, limit });
        console.log('Fetched Requests:', response.data);
        commit('SET_REQUESTS', response.data);
        return response.data; // Return the data for the component
      } catch (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
    },

    async fetchInvestigatorMyRequests({ commit }, payload = { page : 1, limit : 2, status : 'in-progress' }) {
      try {
        let {status ,page, limit} = payload;
        console.log('Fetching investigator requests with status:', status);
        const response = await investigatorMyRequests({ status, page, limit });
        console.log('Fetched Requests:', response.data);
        commit('SET_REQUESTS', response.data);
        return response.data; // Return the data for the component
      } catch (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
    },
    async createRequest({ commit }, request) {
      let createdRequest = await createRequest(request)
      console.log('Created Request:', createdRequest);
      commit('ADD_REQUEST', createdRequest.data);
    },
    updateRequest({ commit }, updatedRequest) {
      commit('UPDATE_REQUEST', updatedRequest);
    },
    async fetchSingleRequest({ commit }, requestId) {
      try {
        const response = await fetchRequestDetails(requestId);
        return response.data;
      } catch (error) {
        console.error('Error fetching request:', error);
        throw error;
      }
    },

    async investigatorRequestAccept({ commit }, requestId) {
      try {
        const response = await investigatorAcceptRequest(requestId);
        console.log('Accepted Request:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error accepting request:', error);
        throw error;
      }
    },
    async switchRole({ commit }, role) {
      try {
        console.log('Switching role to:', role);
        const response = await switchUserRole(role);
        if(response.data){
          let {user, token} = response.data;;
          commit('SET_USER', user);
          commit('SET_TOKEN', token);
          commit('SET_ACTIVE_ROLE', user.activeRole);
        //here i want o call fetchRequests od 63 line
         await this.dispatch('fetchRequests', { page: 1, limit: 2, status: 'pending' });
      }
      console.log('User switched role successfully:', role);
      return Promise.resolve();
      }
      catch (error) {
        console.error('Error switching role:', error);
        throw error;
      }
    },
    async registerUser({ commit }, payload) {
      try {
        // const response = await axios.post('/api/register', payload);
        const response = await signUpApi(payload);
        if(response.data){
            let {user, token} = response.data;;
            commit('SET_USER', user);
            commit('SET_TOKEN', token);
            commit('SET_ACTIVE_ROLE', user.activeRole);
        }
        // commit('SET_USER', response.data);
        console.log('User registered:', payload);
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
    },
    async signIn({ commit }, payload) {
      try {
        const response = await signInApi(payload);
        if(response.data){
            let {user, token} = response.data;;
            commit('SET_USER', user);
            commit('SET_TOKEN', token);
            commit('SET_ACTIVE_ROLE', user.activeRole);
        }
        console.log('User signed in:', payload);
        return Promise.resolve();
      } catch (error) {
        console.error('SignIn Error:', error);
        return Promise.reject(error.response?.data?.message || 'Sign-in failed');
      }
    },

    logout({ commit }) {
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
      commit('SET_ACTIVE_ROLE', null);
      commit('SET_REQUESTS', null);
      localStorage.removeItem('token');
    },

    async updateProfile({ commit }, profileData) {
      console.log('Updating profile with data:', profileData);
      try {
        let response = await updateUserProfile(profileData);
        if(response.data && response.data.user){
          commit('SET_USER', response.data.user);
          // console.log('Profile updated:', response.data,);
          return response.data;
        }
      
      }
      catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    activeRole: state => state.activeRole,
    getRequests: state => state.requests,
  },
  plugins: [createPersistedState()],
});