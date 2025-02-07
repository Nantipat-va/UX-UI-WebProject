
const idUser = localStorage.getItem('idUser');

// ตรวจสอบว่า userId มีค่าไหมก่อนที่จะทำการอัพโหลด
document.getElementById("userImg").addEventListener("change", async function(event) {
    const file = event.target.files[0];

    if (file && idUser) { // ตรวจสอบว่า userId มีค่า
        // แสดงตัวอย่างรูปภาพที่เลือก
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("profileImg").src = e.target.result;
        };
        reader.readAsDataURL(file);

        // สร้าง FormData เพื่อส่งข้อมูลไปยังเซิร์ฟเวอร์
        const formData = new FormData();
        formData.append("image", file);
        formData.append("idUser", idUser);  // ส่ง userId ไปพร้อมกับไฟล์

        try {
            const response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert("Image uploaded successfully!");
            } else {
                alert(result.error || "Error uploading image.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while uploading the image.");
        }
    } else {
        alert("Please log in and select an image.");
    }
});

//load ชื่อ รูปภาพ
document.addEventListener('DOMContentLoaded', (event) =>{
    const username = localStorage.getItem('username');
    const name = document.getElementById('name');

    const idUser = localStorage.getItem('idUser');

    if(!name){
        window.location.href = "../views/login.html"
    }

    if(username){
        name.innerText = username;

    } else {
        window.location.href = "../views/login.html"
    }

    const profileImg = document.getElementById("profileImg");

    // ดึงรูปจาก API
    fetch(`/api/get-image/${idUser}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Image not found");
        }
        return response.blob(); // รับข้อมูลเป็นรูป (Blob)
    })
    .then(imageBlob => {
        // สร้าง URL สำหรับ Blob
        const imageURL = URL.createObjectURL(imageBlob);
        profileImg.src = imageURL; // ตั้งค่า src ของรูปใน img tag
    })
    .catch(error => {
        console.error(error);
        profileImg.alt = "Image not available"; // ถ้าผิดพลาดให้แสดงข้อความ
    });
})