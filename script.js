const CLASSROOM_LAT = 14.574944;
const CLASSROOM_LON = 120.989639;
const RADIUS = 10;

const locationStatus = document.getElementById("location-status");
const submitBtn = document.getElementById("submit-btn");
const attendanceForm = document.getElementById("attendance-form");
const recordsTable = document.getElementById("attendance-records");

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function checkLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const distance = getDistance(userLat, userLon, CLASSROOM_LAT, CLASSROOM_LON);
            
            if (distance <= RADIUS) {
                locationStatus.textContent = "✅ Inside the classroom.";
                locationStatus.style.color = "green";
                submitBtn.disabled = false;
            } else {
                locationStatus.textContent = "❌ You are outside the classroom!";
                locationStatus.style.color = "red";
                submitBtn.disabled = true;
            }
        }, () => {
            locationStatus.textContent = "❌ Unable to get location.";
            locationStatus.style.color = "red";
            submitBtn.disabled = true;
        });
    } else {
        locationStatus.textContent = "❌ Geolocation is not supported by this browser.";
        locationStatus.style.color = "red";
        submitBtn.disabled = true;
    }
}

checkLocation();

attendanceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const studentName = document.getElementById("student-name").value;
    const deviceId = localStorage.getItem("device_id") || Math.random().toString(36).substring(2, 15);
    localStorage.setItem("device_id", deviceId);

    if (localStorage.getItem(`submitted_${deviceId}`)) {
        alert("❌ Attendance already submitted!");
        return;
    }
    
    const grade = document.getElementById("grade").value;
    const strand = document.getElementById("strand").value;
    const attendanceStatus = document.getElementById("attendance-status").value;
    const checkInTime = new Date().toLocaleTimeString();
    const checkInDate = new Date().toLocaleDateString();

    const newRow = `<tr>
                        <td>${studentName}</td>
                        <td>${grade}</td>
                        <td>${strand}</td>
                        <td>${attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1)}</td>
                        <td>${checkInTime}</td>
                        <td>${checkInDate}</td>
                    </tr>`;
    recordsTable.innerHTML += newRow;
    
    localStorage.setItem(`submitted_${deviceId}`, "true");

    window.location.href = "thankyou.html";
});
