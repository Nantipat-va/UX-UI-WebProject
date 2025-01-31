document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // รับค่าที่กรอกจากฟอร์ม
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const bio = document.getElementById('bio').value;

    // แสดงข้อมูลในโปรไฟล์
    document.getElementById('profile-name').textContent = 'ชื่อ: ' + name;
    document.getElementById('profile-email').textContent = 'อีเมล์: ' + email;
    document.getElementById('profile-bio').textContent = 'เกี่ยวกับคุณ: ' + bio;

    // แสดงผลโปรไฟล์
    document.getElementById('profile-output').style.display = 'block';
});

// สคริปต์สำหรับแสดงรูปโปรไฟล์ที่อัพโหลด
const fileInput = document.getElementById('profile-pic');
const profileImg = document.getElementById('profile-img');
 
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function() {
        profileImg.src = reader.result;
    }
    reader.readAsDataURL(file);
});