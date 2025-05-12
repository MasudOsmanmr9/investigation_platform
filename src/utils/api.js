import axios from 'axios';
import store from '../store'; // Adjust the path to your Vuex store

const apiClient = axios.create({
    // baseURL: process.env.VUE_APP_API_URL,
    baseURL: 'http://localhost:3000/api', // Set your API base URL here
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiClientUpload = axios.create({
    // baseURL: process.env.VUE_APP_API_URL,
    baseURL: 'http://localhost:3000/api', // Set your API base URL here
    headers: {
        'Content-Type': 'multipart/form-data',
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

apiClient.interceptors.response.use(
    response => {
        // If the response is successful, just return it
        return response;
    },
    error => {
        // Check if the error response status is 401 (Unauthorized)
        if (error.response) {
            const { status, data } = error.response;
            console.log('Error response:', error.response);
            // Handle 401 Unauthorized
            if (status === 401) {
                if (data.errors && data.errors[0] && data.errors[0].message === 'Unauthorized. Invalid token.') {
                    console.error('Token expired. Logging out...');
                    
                    // Dispatch the Vuex logout action
                    store.dispatch('logout');
                    console.log('dispatcheddddddddddddd')
                    // Redirect to the sign-in page
                    window.location.href = '/signin'; // Adjust the path if necessary
                } else if (data.message === 'Unauthorized. No token provided.') {
                    console.error('No token provided. Redirecting to sign-in...');
                    
                    // Redirect to the sign-in page
                    window.location.href = '/signin'; // Adjust the path if necessary
                }
            }

            // Handle 403 Forbidden
            if (status === 403) {
                console.error('Forbidden:', data.message);
                
                // Redirect to the dashboard or show an error message
                window.location.href = '/dashboard'; // Adjust the path if necessary
            }
        }
        // Reject the promise with the error object
        return Promise.reject(error);
    }
);

// Interceptor to add token to headers
apiClientUpload.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});


export const uploadFileApi = async (formData,requestId) => {
    let response = await apiClientUpload.post(`/investigators/reports/${requestId}`, formData);
    return response;
};
// Function to sign up a new user
export const signUpApi = async (userData) => {
    let response = await apiClient.post('/auth/signup', userData);
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

// Function to create a new investigation request
export const createRequest = async (requestData) => {
    let response = await apiClient.post('/requests', requestData);
    return response;
};

// Function to fetch requester's requests
export const fetchMyRequests = ({status='pending',page=1,limit=10}) => {
    return apiClient.get(`/requests/me?status=${status}&page=${page}&limit=${limit}`);
};

export const investigatorMyRequests = ({status='pending',page=1,limit=10}) => {
    return apiClient.get(`/investigators/my-requests?status=${status}&page=${page}&limit=${limit}`);
};

export const browseRequests = ({status='pending',page=1,limit=10}) => {
    return apiClient.get(`investigators/requests?page=${page}&limit=${limit}`);
};

export const investigatorAcceptRequest = (requestId) => {
    return apiClient.post(`/investigators/requests/${requestId}/accept`);
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

// Function to fetch a user's profile by ID
export const getUserProfileApi = (userId) => {
    return apiClient.get(`/users/investigator/${userId}`);
};
// Create a new review
export const createReviewApi = (reviewData) => {
    return apiClient.post('/reviews', reviewData);
};

// Get reviews for an investigator with pagination
export const getInvestigatorReviewsApi = (investigatorId, page = 1, limit = 5) => {
    return apiClient.get(`/reviews/investigator/${investigatorId}?page=${page}&limit=${limit}`);
};

// Function to fetch reviews for a user (e.g., investigator)
export const fetchUserReviews = (userId) => {
    return apiClient.get(`/users/${userId}/reviews`);
};
// Function to rate and review an investigator
export const rateInvestigator = (investigatorId, ratingData) => {
    return apiClient.post(`/investigators/${investigatorId}/rate`, ratingData);
};

export const fetchDashboardDataApi = (investigatorId) => {
    return apiClient.get(`/users/dashboard`);
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