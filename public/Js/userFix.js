
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

    // ถังขะยะ
    document.getElementById("checkbox2").addEventListener("change", function() {
        var deleteButton = document.querySelector(".post-post .manage .delete-button");
        if (this.checked) {
            deleteButton.style.opacity = 0; // ซ่อนถังขยะ
        } else {
            deleteButton.style.opacity = 1; // แสดงถังขยะ
        }
    });

})


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
        saveButton.addEventListener("click", () => {
            const newText = textInput.value.trim();
            textSpan.textContent = newText || originalText;
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
