const content = document.getElementById('content');
const studentListLink = document.getElementById('studentListLink');
const studentUpdateLink = document.getElementById('studentUpdateLink');

const API_URL = "http://localhost:3000/students";



async function grabStudents() {
    try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch students.');
            const students = await response.json();
            return students;
        }
    catch (error) {
        console.log(error.message);
    }
   }



  
async function storeStudents(student) {

    const method = 'POST'
    fetch(API_URL, {
      method: method,
      body: JSON.stringify(student),
      headers: {
          "Content-Type": "application/json; charset=UTF-8"
      }
  })

  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to save student.');
      }
      return response.json();
  })

  .then(data => console.log('Student saved successfully:', data))

  .catch(error => {
      console.error('Error saving student:', error);
      alert('Failed to save student.');
  });
}
async function updateStudents(student,id) {
   
    const method = 'PUT'
      await fetch(`${API_URL}/${id}`, {
      method: method,
      body: JSON.stringify(student),
      headers: {
          "Content-Type": "application/json; charset=UTF-8"
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to save student.');
      }
     
      return response.json();
  })

  .then(data => console.log('Student saved successfully:', data))

  .catch(error => {
      console.error('Error saving student:', error);
      alert('Failed to save student.');
  });
}

async function listStudents() {
    const response = await fetch(API_URL);
     const students = await response.json();
     console.log(students);
    if (students.length === 0) {
        content.innerHTML = `<p>Add a student.</p>`;
    } else {
        const table = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Grade</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    ${  
                        students.map((student,index) => `
                        <tr>
                            <td class="studentID" >${student.id}</td>
                            <td class="studentName">${student.name}</td>
                             <td class="studentAge" >${student.age}</td>
                            <td class="studentGrade">${student.grade}</td>
                            <td class="edit" ><button type="button" class="editButton" id="${student.id}" onclick="editStudent(${index})" >Edit</button></td
                            
                            </tr>
                    `).join('')
                 
                }
                </tbody>
            </table>
        `;
        content.innerHTML = table;
    }

}

async function studentForm(index) {
    const form = `
        <form>
            <label for="studentId">Student ID:</label>
            <input type="number" id="studentId" placeholder="Enter Student ID" required>
            <label for="studentName">Student Name:</label>
            <input type="text" id="studentName" placeholder="Enter Student Name" required>
            <label for="studentAge">Student Age:</label>
            <input type="number" id="studentAge" placeholder="Enter Student Age" required>
            <label for="studentGrade">Student Grade:</label>
            <input type="text" id="studentGrade" placeholder="Enter Student Grade" required>

            <button class="submitButton" type="button" onclick="${typeof index == 'number' ? `saveEditStudent(${index})` : "saveStudent()"}">Update Student</button>
        </form>
            <div class="wrap">
            <input id="studentFile" type="file" name="file" />
            <button type="submit" onclick="uploadFile(event)">upload</button>
            </div>
    `;
    content.innerHTML = form;
    
}

async function saveStudent() {
    const studentId = parseInt(document.getElementById('studentId').value); 
    const studentName = document.getElementById('studentName').value;
    const studentAge = parseInt(document.getElementById('studentAge').value);
    const studentGrade = document.getElementById('studentGrade').value;
  
    if (studentName && studentGrade) {
        const student = { id: studentId, name: studentName, age: studentAge, grade:studentGrade,file : studentFile }; 
        await storeStudents(student);
        alert('Student saved successfully!');
        await listStudents();
    } else {
        alert('Please fill in all required fields.');
    }
}

studentListLink.addEventListener('click', (e) => {
    e.preventDefault();
    listStudents();
});

studentUpdateLink.addEventListener('click', (e) => {
    e.preventDefault();
    studentForm();
});


async function editStudent(index){
   
    studentForm(index);
    

    let editStudents = await fetch(API_URL);
    
    parsedStudents = await editStudents.json();
    
   const student = parsedStudents[index];
   
   document.getElementById('studentId').value = student.id;
   document.getElementById('studentName').value = student.name;
   document.getElementById('studentAge').value = student.age;
   document.getElementById('studentGrade').value = student.grade;
  
}

async function saveEditStudent(index){
     
   const editStudents = await fetch(API_URL);
    parsedStudents = await editStudents.json();
   
    const student = parsedStudents[index];
    
    student.id = parseInt(document.getElementById('studentId').value);
    student.name= document.getElementById('studentName').value;
    student.age = parseInt(document.getElementById('studentAge').value);
    student.grade = document.getElementById("studentGrade").value;
    
     await updateStudents(student,student.id);
     await listStudents();
    }

async function uploadFile(event){
    event.preventDefault();
    const file = document.getElementById("studentFile");
  
    let formData = new FormData();
    formData.append("file",file.files[0]);
   try {
     let response =  await fetch(`http://localhost:3000/upload`, {
         method: "POST",
        body: formData
    });
    if (!response.ok) throw new Error('Failed to upload file.');
    const data = await response.json();
    console.log('File uploaded successfully:', data);
    alert('File uploaded successfully!');

} catch (error) {
    console.error('Error uploading file:', error);
    alert('Failed to upload file.');
}
}
listStudents();
