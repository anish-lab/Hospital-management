function switchTab(tabId, element) {
    const views = document.querySelectorAll('.view-section');
    views.forEach(view => {
        view.classList.remove('active-view');
    });
    
    const links = document.querySelectorAll('.nav-links li');
    links.forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active-view');
    element.classList.add('active');
}

let latestPatientNumber = 1002; 

function generatePatientID() {
    latestPatientNumber++;
    return `HSP${latestPatientNumber}`;
}

function openPatientModal() {
    const form = document.getElementById('add-patient-form');
    const idInput = document.getElementById('patient-id');
    
    idInput.value = generatePatientID();
    form.style.display = 'block';
}

function closePatientModal() {
    document.getElementById('add-patient-form').style.display = 'none';
}


async function savePatient() {

    const patientData = {
        patient_id: document.getElementById('patient-id').value,
        full_name: document.querySelector('input[placeholder="Enter patient name"]').value,
        age: document.querySelector('input[placeholder="Enter age"]').value,
        phone: document.querySelector('input[placeholder="Enter phone"]').value
    };

    if (!patientData.full_name || !patientData.age || !patientData.phone) {
        alert("Please fill in all patient details (Name, Age, and Contact Number).");
        return;
    }

    try {

        const response = await fetch('http://localhost:5000/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            
            document.querySelector('input[placeholder="Enter patient name"]').value = '';
            document.querySelector('input[placeholder="Enter age"]').value = '';
            document.querySelector('input[placeholder="Enter phone"]').value = '';
            
            closePatientModal();
            
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error connecting to server:", error);
        alert("Could not connect to the backend server. Make sure your Python server is running!");
    }
}
