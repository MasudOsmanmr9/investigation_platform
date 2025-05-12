export function processError(error) {
    if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
        const { status, data } = error.response;
        console.log('Error response:', error.response);
         if (status === 401) {
              if (data.message === 'Unauthorized. Invalid token.') {
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
      const errors = error.response.data.errors;
      return `
        <div className="alert alert-danger">
          <h4>Oooops....</h4>
          <ul className="my-0">
            ${errors.map((err) => `<li key="${err.message}">${err.message}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    console.log('process Errorr:', error);
    // If no structured errors, return the error as is
    return error;
  }