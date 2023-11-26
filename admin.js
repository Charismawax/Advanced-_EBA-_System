document.addEventListener('DOMContentLoaded', function () {
  const addStudentForm = document.querySelector('#add-student-form');
  const addNoteForm = document.querySelector('#add-note-form');
  const deleteStudentForm = document.querySelector('#delete-student-form');

  // Event listener for adding a student
  addStudentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const studentName = document.querySelector('#student-name').value;
    const studentClass = document.querySelector('#student-class').value;

    const studentData = {
      username: studentName,
      class: studentClass
    };
    const url = new URL("http://localhost:3000/students")
    console.log(JSON.stringify(studentData));
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentData)
    })
      .then(response => response.json())
      .then(data => {
        alert('Student added successfully');
        addStudentForm.reset();
      })
      .catch(error => {
        console.error(error);
        alert('Failed to add student');
      });
  });

  // Event listener for adding a note
  addNoteForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const studentNameNote = document.querySelector('#student-name-note').value;
    const subject = document.querySelector('#subject').value;
    const note = document.querySelector('#note').value;

    const noteData = {
      studentName: studentNameNote,
      subject: subject,
      grade: note
    };
    const url = new URL("http://localhost:3000/results")
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(noteData)
    })
      .then(response => response.json())
      .then(data => {
        alert('Note added successfully');
        addNoteForm.reset();
      })
      .catch(error => {
        console.error(error);
        alert('Failed to add note');
      });
  });

  // Event listener for deleting a student
  deleteStudentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const studentNameDelete = document.querySelector('#student-name-delete').value;
    const url = new URL(`http://localhost:3000/students/${studentNameDelete}`)
    fetch(url, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        alert('Student deleted successfully');
        deleteStudentForm.reset();
      })
      .catch(error => {
        console.error(error);
        alert('Failed to delete student');
      });
  });

  // Event listener for logout button
  const logoutBtn = document.querySelector('#logout-btn');
  logoutBtn.addEventListener('click', function () {
    window.location.href = '/login.html';
  });
});
