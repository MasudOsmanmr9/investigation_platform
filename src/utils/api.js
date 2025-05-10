import axios from 'axios';

const apiClient = axios.create({
    // baseURL: process.env.VUE_APP_API_URL,
    baseURL: 'http://localhost:3000/api', // Set your API base URL here
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to headers
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Function to sign up a new user
export const signUpApi = async (userData) => {
    let response = await apiClient.post('/auth/signup', userData);
    console.log('Response from signUpApi:', response);
    return response;
};

// Function to sign in a user
export const signInApi = (credentials) => {
    return apiClient.post('/auth/signin', credentials);
};

// Function to switch user role
export const switchUserRole = (role) => {
    return apiClient.patch('/users/switch-role', { switchRoleto:role });
};
// Function to fetch user's profile
export const fetchUserProfile = () => {
    return apiClient.get('/user/profile');
};

// Function to update user's profile
export const updateUserProfile = (profileData) => {
    return apiClient.put('/users/update-profile', profileData);
};

// Function to fetch reviews for a user (e.g., investigator)
export const fetchUserReviews = (userId) => {
    return apiClient.get(`/users/${userId}/reviews`);
};

// Function to create a new investigation request
export const createRequest = async (requestData) => {
    console.log('Request Data acccesss:', requestData);
    let response = await apiClient.post('/requests', requestData);
    return response;
};

// Function to fetch requester's requests
export const fetchMyRequests = ({status='pending',page=1,limit=10}) => {
    console.log('Fetching requests apijs limit', limit);
    return apiClient.get(`/requests/me?status=${status}&page=${page}&limit=${limit}`);
};

// Function to fetch available requests for investigators
export const fetchAvailableRequests = () => {
    return apiClient.get('/requests/available');
};

// Function to fetch request details
export const fetchRequestDetails = (requestId) => {
    return apiClient.get(`/requests/details/${requestId}`);
};

// Function to submit an investigator's report
export const submitReport = (requestId, reportData) => {
    return apiClient.post(`/requests/${requestId}/report`, reportData);
};

// Function to rate and review an investigator
export const rateInvestigator = (investigatorId, ratingData) => {
    return apiClient.post(`/investigators/${investigatorId}/rate`, ratingData);
};

export const downloadReport = async (requestId) => {
    try {
        const response = await apiClient.get(`/reports/download/${requestId}`, {
            responseType: 'blob', // Important: Set response type to 'blob' for file downloads
        });

        // Create a URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Extract the file name from the response headers or set a default name
        const contentDisposition = response.headers['content-disposition'];
        const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : `report-${requestId}.pdf`;

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading the report:', error);
        throw error;
    }
};