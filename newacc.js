document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.querySelector('#register-form');
  const usernameInput = document.querySelector('#username');
  const passwordInput = document.querySelector('#password');
  const confirmPasswordInput = document.querySelector('#confirm_password');
  const usernameError = document.querySelector('#username_error');
  const passwordError = document.querySelector('#password_error');
  const confirmPasswordError = document.querySelector('#confirm_password_error');

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Clear previous error messages
    usernameError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';

    // Get form values
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Validate form inputs
    let isValid = true;

    if (username === '') {
      usernameError.textContent = 'Username is required';
      isValid = false;
    }

    if (password === '') {
      passwordError.textContent = 'Password is required';
      isValid = false;
    }

    if (confirmPassword === '') {
      confirmPasswordError.textContent = 'Confirm password is required';
      isValid = false;
    }

    if (password !== confirmPassword) {
      confirmPasswordError.textContent = 'Passwords do not match';
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Perform registration logic
    const registerData = {
      username,
      password
    };

    const url = new URL('http://localhost:3000/register');
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    })
      .then(response => response.json())
      .then(data => {
        alert('Account created successfully');
        registerForm.reset();
        window.location.href = 'login.html';
      })
      .catch(error => {
        console.error(error);
        alert('Failed to create account');
      });
  });
});
