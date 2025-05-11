import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

// Importing pages
import SignIn from '../pages/Auth/SignIn.vue';
import SignUp from '../pages/Auth/SignUp.vue';
import Dashboard from '../pages/Dashboard.vue';
import Profile from '../pages/Profile.vue';
import CreateRequest from '../pages/Requester/CreateRequest.vue';
import MyRequestList from '../pages/Requester/MyRequestList.vue';
import RequestDetailViewRequester from '../pages/Requester/RequestDetailView.vue';
import ViewRequests from '../pages/Investigator/ViewRequests.vue';
import RequestDetailViewInvestigator from '../pages/Investigator/RequestDetailView.vue';
import SubmitReport from '../pages/Investigator/SubmitReport.vue';
import UserProfile from '../pages/UserProfile.vue';
import NotFound from '../pages/NotFound.vue';
import InvestigatorProfile from '../pages/InvestigatorProfile.vue';
import ChatRoom from '../pages/ChatRoom.vue';
const routes = [
  {
    path: '/',
    redirect: '/signin'
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfile,
    meta: { requiresAuth: true, role: 'both' } // Assuming both roles can access this
  },
  {
    path: '/requester/create',
    name: 'CreateRequest',
    component: CreateRequest,
    meta: { requiresAuth: true, role: 'requester' }
  },
  {
    path: '/requester/my-requests',
    name: 'MyRequestList',
    component: MyRequestList,
    meta: { requiresAuth: true, role: 'requester' }
  },
  {
    path: '/requester/request-detail/:id',
    name: 'RequestDetailViewRequester',
    component: RequestDetailViewRequester,
    meta: { requiresAuth: true, role: 'requester' }
  },
  {
    path: '/investigators/user/profile/:id',
    name: 'InvestigatorUserProfile',
    // component: () => import('@/pages/InvestigatorProfile.vue'),
    component: InvestigatorProfile,
    meta: { requiresAuth: true, role: 'requester' }, // Only requesters can access this
  },
  {
    path: '/investigator/view-requests',
    name: 'ViewRequests',
    component: ViewRequests,
    meta: { requiresAuth: true, role: 'investigator' }
  },
  {
    path: '/investigator/request-detail/:id',
    name: 'RequestDetailViewInvestigator',
    component: RequestDetailViewInvestigator,
    meta: { requiresAuth: true, role: 'investigator' }
  },
  {
    path: '/investigator/submit-report/:id',
    name: 'SubmitReport',
    component: SubmitReport,
    meta: { requiresAuth: true, role: 'investigator' }
  },
  {
    // path: '/update-profile/:id',
    path: '/update-profile',
    name: 'UpdateProfile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/chat-to/:id',
    name: 'chatRoom',
    component: ChatRoom,
    meta: { requiresAuth: true, role: 'both' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Route guard for authentication and role-based access
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userRole = store.state.user?.role;
  const userActivRole = store.state.activeRole; // Assuming user role is stored in Vuex
  const roleRequired = to.meta.role;

  if(store.state.isAuthenticated && roleRequired === 'both') {
    next();
  }

  if((to.name === 'SignIn' || to.name === 'SignUp') && store.state.isAuthenticated) {
    next({ name: 'Dashboard' });
  }
  if (requiresAuth && !store.state.isAuthenticated) {
    next({ name: 'SignIn' });
  } else if (roleRequired && userActivRole !== roleRequired) {
    next({ name: 'Dashboard' }); // Redirect to dashboard if role doesn't match
  } else {
    next();
  }
});

export default router;