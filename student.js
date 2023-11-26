document.addEventListener('DOMContentLoaded', function () {
  const studentTable = document.querySelector('#student-table');

  // Fetch and display student results
  const fetchStudentResults = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated');
      window.location.href = 'login.html';
      return;
    }

    const url = new URL("http://localhost:3000/results");
    fetch(url, {
      headers: {
        'token': localStorage.getItem('token'),
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        // Clear previous table data
        while (studentTable.firstChild) {
          studentTable.firstChild.remove();
        }

        // Create table rows for each result
        data.forEach(result => {
          const row = document.createElement('tr');
          const subjectCell = document.createElement('td');
          const gradeCell = document.createElement('td');

          subjectCell.textContent = result.subject;
          gradeCell.textContent = result.grade;

          row.appendChild(subjectCell);
          row.appendChild(gradeCell);

          studentTable.appendChild(row);
        });
      })
      .catch(error => {
        console.error(error);
        alert('Failed to fetch student results');
      });
  };

  // Check if user is authenticated and fetch results
  const token = localStorage.getItem('token');
  if (!token) {
    alert('User not authenticated');
    window.location.href = 'login.html';
  } else {
    fetchStudentResults();
  }

  // Event listener for logout button
  const logoutBtn = document.querySelector('#logout-btn');
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = './login.html';
  });
});
