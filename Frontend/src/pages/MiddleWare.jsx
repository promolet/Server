// authMiddleware.js
export const authMiddleware = (actionCallback) => {
    // Check if the user is authenticated (you can adjust this logic based on your app)
    const token = localStorage.getItem("token"); // Example: Checking token in localStorage
  
    if (token) {
      // If authenticated, proceed with the action
      actionCallback();
    } else {
      // If not authenticated, redirect to login or show a warning
      alert("You need to log in to perform this action.");
      window.location.href = "/login"; // Redirect to login page
    }
  };
  