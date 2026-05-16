// ==========================================
// 1. UI & Navigation Logic
// ==========================================

// Tab Switching Logic
function switchTab(tabId, element) {
    // Hide all views
    const views = document.querySelectorAll('.view-section');
    views.forEach(view => {
        view.classList.remove('active-view');
    });

    // Remove active class from all nav links
    const links = document.querySelectorAll('.nav-links li');
    links.forEach(link => {
        link.classList.remove('active');
    });

    // Show selected view and highlight nav item
    document.getElementById(tabId).classList.add('active-view');
    element.classList.add('active');
}

// ==========================================
// 2. Patient Management Logic
// ==========================================

// Patient ID Generator Logic (Simulating latest DB entry)
let latestPatientNumber = 1002; 

function generatePatientID() {
    latestPatientNumber++;
    return `HSP${latestPatientNumber}`;
}

// Modal/Form UI Logic
function openPatientModal() {
    const form = document.getElementById('add-patient-form');
    const idInput = document.getElementById('patient-id');
    
    // Auto-generate the ID when opening the form
    idInput.value = generatePatientID();
    form.style.display = 'block';
}

function closePatientModal() {
    document.getElementById('add-patient-form').style.display = 'none';
}

// ==========================================
// 3. Full-Stack API Connection (Backend)
// ==========================================

async function savePatient() {
    // Gather data from the form inputs
    const patientData = {
        patient_id: document.getElementById('patient-id').value,
        full_name: document.querySelector('input[placeholder="Enter patient name"]').value,
        age: document.querySelector('input[placeholder="Enter age"]').value,
        phone: document.querySelector('input[placeholder="Enter phone"]').value
    };

    // Basic frontend validation
    if (!patientData.full_name || !patientData.age || !patientData.phone) {
        alert("Please fill in all patient details (Name, Age, and Contact Number).");
        return;
    }

    try {
        // Send data to the Python/Flask Backend
        const response = await fetch('http://localhost:5000/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        const result = await response.json();

        // Handle the backend response
        if (response.ok) {
            alert(result.message); // Show success message from Python
            
            // Clear the form fields
            document.querySelector('input[placeholder="Enter patient name"]').value = '';
            document.querySelector('input[placeholder="Enter age"]').value = '';
            document.querySelector('input[placeholder="Enter phone"]').value = '';
            
            // Close the modal
            closePatientModal();
            
        } else {
            // Show error message if patient ID exists or other DB error
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error connecting to server:", error);
        alert("Could not connect to the backend server. Make sure your Python server is running!");
    }
}