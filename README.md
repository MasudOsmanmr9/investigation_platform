# investigation_platform
this project developed by vue js , used vue 3, project initialized by vue cli, used vuex for state management, we used option api, we will try composition api in future


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```


## User Journey and Routes

### **Authentication**
1. **Sign In** (`/signin`):
   - Users can log in to the platform using their credentials.
2. **Sign Up** (`/signup`):
   - New users can register for an account.

---

### **Dashboard**
- **Dashboard** (`/dashboard`):
  - Displays an overview of activities and counts based on the user's role (e.g., investigator or requester).

---

### **Requester Features**
1. **Create Request** (`/requester/create`):
   - Requesters can create a new investigation request.
2. **My Requests** (`/requester/my-requests`):
   - View a list of all requests created by the requester.
3. **Request Details** (`/requester/request-detail/:id`):
   - View detailed information about a specific request, including its status and assigned investigator.

---

### **Investigator Features**
1. **View Requests** (`/investigator/view-requests`):
   - Investigators can browse available requests and accept them.
2. **Request Details** (`/investigator/request-detail/:id`):
   - View detailed information about a specific request assigned to the investigator.
3. **Submit Report** (`/investigator/submit-report/:id`):
   - Submit a report for a completed investigation.

---

### **Profiles**
1. **User Profile** (`/profile`):
   - View and update the logged-in user's profile.
2. **Investigator Profile** (`/investigators/user/profile/:id`):
   - Requesters can view an investigator's profile, including reviews and contact details.

---

### **Chat**
- **Chat Room** (`/user/chat-to/:id`):
  - Users can chat with investigators or requesters in real-time.

---

### **Error Handling**
- **404 Not Found** (`/:pathMatch(.*)*`):
  - Displays a "Not Found" page for invalid routes.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
