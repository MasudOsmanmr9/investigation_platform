export function processError(error) {
    if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
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