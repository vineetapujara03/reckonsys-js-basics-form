const content = document.getElementById('content');
const studentListLink = document.getElementById('studentListLink');

function grabStudents() {
    const students = JSON.parse(localStorage.getItem('students'));
    return students || []; 
}

function storeStudents(students) {
    localStorage.setItem('students', JSON.stringify(students));
}

function listStudents() {
    const students = grabStudents();
    if (students.length === 0) {
        content.innerHTML = `<p>Add a student.</p>`;
    } else {
        const table = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Rank</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    ${  
                        students.map((student,index,students) => `
                        <tr>
                            <td class="studentID" >${student.id}</td>
                            <td class="studentName">${student.name}</td>
                            <td class="studentRank">${student.rank}</td>
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

function studentForm(index) {
    const form = `
        <form>
            <label for="studentId">Student ID:</label>
            <input type="number" id="studentId" placeholder="Enter Student ID" required>
            <label for="studentName">Student Name:</label>
            <input type="text" id="studentName" placeholder="Enter Student Name" required>
            <label for="studentRank">Student Rank:</label>
            <input type="number" id="studentRank" placeholder="Enter Student Rank" required>
            <button class="submitButton" type="button" onclick="${typeof index == 'number' ? `saveEditStudent(${index})` : "saveStudent()"}">Update Student</button>
           
        </form>
    `;
    content.innerHTML = form;
    
}

function saveStudent() {
    const studentId = parseInt(document.getElementById('studentId').value);
    const studentName = document.getElementById('studentName').value;
    const studentRank = document.getElementById('studentRank').value;

    if (studentId && studentName && studentRank) {
        let students = grabStudents();
    
            students.push({ id: studentId, name: studentName, rank: studentRank });
        
        storeStudents(students);
     
        alert("Student saved successfully!");
        listStudents();
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


function editStudent(index){
    console.log("run")
  
    studentForm(index);
    
    let editStudents = localStorage.getItem("students")
    
    parsedStudents = JSON.parse(editStudents);
    
   const student = parsedStudents[index];
   
   document.getElementById('studentId').value = student.id;
   document.getElementById('studentName').value = student.name;
   document.getElementById('studentRank').value = student.rank;
}

function saveEditStudent(index){
    editStudents = localStorage.getItem("students")
     
    parsedStudents = JSON.parse(editStudents);
    
   const student = parsedStudents[index];

    student.id = parseInt(document.getElementById('studentId').value);
    student.name= document.getElementById('studentName').value;
    student.rank = document.getElementById('studentRank').value;
     
    localStorage.setItem("students",JSON.stringify(parsedStudents)); 
    storeStudents(parsedStudents);
    listStudents();
}

function findStudents() {
    const studentId = parseInt(document.getElementById('#studentId').value);
    if (studentId) {
        const students = grabStudents();
        const student = students.find(s => s.id === studentId);
        if (student) {
            studentForm();
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentRank').value = student.rank;
        }
    }
}

listStudents();
