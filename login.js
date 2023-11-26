document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector('#login-form');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const usertype = document.querySelector('#usertype').value.toLowerCase();

    const loginData = {
      username,
      password,
      usertype
    };

    // Perform user authentication
    const url = new URL("http://localhost:3000/login");
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(response => response.json())
      .then(data => {
        // Check if authentication was successful
        if (data.token) {
          // Save the token in local storage
          localStorage.setItem('token', data.token);

          // Redirect to the appropriate page based on user type
          if (usertype === 'admin') {
            window.location.href = 'admin.html';
          } else if (usertype === 'student') {
            window.location.href = 'student.html';
          }
        } else {
          alert('Invalid username or password');
        }
      })
      .catch(error => {
        console.error(error);
        alert('Failed to authenticate user');
      });
  });
});
