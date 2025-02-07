
document.addEventListener("DOMContentLoaded", () =>{
    const checkbox = document.getElementById('checkbox1');
    const userfix = document.getElementById('userFix');

    checkbox.addEventListener('change', () =>{
        if(checkbox.checked){
            userfix.style.display = 'none';

        }  else{
            userfix.style.display = 'block';
        }
            
    })
})

//function updata info
document.getElementById("userFix").addEventListener("click", (event) => {
    if (event.target.closest(".edit-button")) {
        event.stopPropagation();

        // ดึงองค์ประกอบที่ต้องการแก้ไข
        const labelGroup = event.target.closest(".label-group");
        const textSpan = labelGroup.querySelector("span");
        const editButton = labelGroup.querySelector(".edit-button");
        const labelshow = labelGroup.querySelector('.labelshow');

        // เก็บข้อความต้นฉบับ
        const originalText = textSpan.textContent.trim();

        // สร้าง input สำหรับแก้ไข
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.value = originalText;
        textInput.classList.add("editInput");

        labelshow.appendChild(textInput); // เพิ่ม input ใน labelshow

        // ซ่อน span
        textSpan.style.display = "none";
        editButton.style.display = "none";

        // สร้างปุ่ม Save และ Cancel
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("editButtonGroup");

        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.classList.add("saveButton");

        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.classList.add("cancelButton");

        labelGroup.appendChild(buttonContainer);
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        

        // Event สำหรับบันทึกการแก้ไข
        saveButton.addEventListener("click", async (event) => {
            const newText = textInput.value.trim();
            textSpan.textContent = newText || originalText;

            const username = document.getElementById('name').textContent.trim();
            const email = document.getElementById('email').textContent.trim();
            const password = document.getElementById('pass').textContent.trim();

            const idUser = localStorage.getItem('idUser');

            if (!username || !email || !password || !idUser) {
                alert("Please fill in all fields.");
                return; // หยุดการทำงานหากมีค่าใดๆ เป็น null หรือ empty
            }

            try {
                const response = await fetch('/api/update-user-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idUser, username, email, password }),
                });
        
                const result = await response.json();

                console.log('Response:', result);

                if (response.ok) {
                    alert(result.msg || "Change successful!");

                    localStorage.setItem('username', result.user.username);
                    localStorage.setItem('idUser', result.user.idUser);
                    localStorage.setItem('email', result.user.email);
                    localStorage.setItem('pass', result.user.password);
                    location.reload('/');
                    clear(); // ฟังก์ชันทำความสะอาดฟอร์ม
                } else {
                    alert(result.error || "Unexpected error occurred");
                }
            } catch (err) {
            }
            cleanup();
        });

        // Event สำหรับยกเลิกการแก้ไข
        cancelButton.addEventListener("click", () => {
            cleanup();
        });

        // ฟังก์ชันทำความสะอาดและคืนค่าหน้าตา
        function cleanup() {
            editButton.style.display = "block";
            textSpan.style.display = "inline";
            labelshow.removeChild(textInput);  // ลบ textInput
            labelGroup.removeChild(buttonContainer);  // ลบ buttonContainer
        }
    }

});

const idUser = localStorage.getItem('idUser');

// function updata รูป
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

// function ดึงรูป ชื่อ อีเมล และพาส จากdatabase
document.addEventListener('DOMContentLoaded', (event) =>{
    const username = localStorage.getItem('username');
    const name = document.getElementById('name');
    
    const useremail = localStorage.getItem('email');
    const email = document.getElementById('email');

    const userpass = localStorage.getItem('pass');
    const pass = document.getElementById('pass');
    

    if(username){
        name.innerText = username;
        email.innerText = useremail;
        pass.innerText= userpass;
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
