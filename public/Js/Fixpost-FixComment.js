document.addEventListener("DOMContentLoaded", function() {
    const postContainer = document.getElementById("displayPost");

    // ใช้ event delegation สำหรับการคลิกที่ไอคอน toggleFixPost
    postContainer.addEventListener("click", function(event) {
        // ตรวจสอบว่าเป็นไอคอน toggleFixPost หรือไม่
        if (event.target.classList.contains("toggleFixPost")) {
            event.stopPropagation(); // ป้องกันการปิดเมนูถ้าคลิกที่ไอคอน

            // ค้นหาเมนูที่เป็นลูกของโพสต์เดียวกัน
            const menu = event.target.nextElementSibling;

            // ปิดเมนูทุกตัวก่อนเปิดตัวที่กด
            postContainer.querySelectorAll(".menuFixpost").forEach(m => {
                if (m !== menu) m.classList.remove("show");
            });

            // เปิด/ปิด เมนูของโพสต์นี้
            menu.classList.toggle("show");
        }

        // ตรวจสอบว่าเป็นไอคอน toggleFixComment หรือไม่
        if (event.target.classList.contains("toggleFixComment")) {
            event.stopPropagation(); // ป้องกันการปิดเมนูถ้าคลิกที่ไอคอน

            // ค้นหาเมนูที่เป็นลูกของความคิดเห็นเดียวกัน
            const menu = event.target.nextElementSibling;

            // ปิดเมนูทุกตัวก่อนเปิดตัวที่กด
            postContainer.querySelectorAll(".menuFixComment").forEach(m => {
                if (m !== menu) m.classList.remove("show");
            });

            // เปิด/ปิด เมนูของความคิดเห็นนี้
            menu.classList.toggle("show");
        }
    });

    // คลิกที่อื่นให้ปิดเมนู
    document.addEventListener("click", function() {
        postContainer.querySelectorAll(".menuFixpost").forEach(m => m.classList.remove("show"));
        postContainer.querySelectorAll(".menuFixComment").forEach(m => m.classList.remove("show"));
    });



    // แก้ไขPOST
    postContainer.addEventListener('click', (event) =>{
        if (event.target.classList.contains('editPost')){
            event.stopPropagation();

            // ดึงองค์ประกอบที่ต้องการแก้ไข
            const postElement = event.target.closest('.post');
            const postContent = postElement.querySelector('.mainContent p');
            
            // แยกข้อความและรูปภาพออกมา
            const textContent = postContent.childNodes[0]?.nodeValue.trim() || '';
            const imageSpan = postContent.querySelector('span');

            // สร้าง textarea สำหรับแก้ไขข้อความ
            const textArea = document.createElement('textarea');
            textArea.value = textContent;
            textArea.classList.add('editTextarea');
            
            // ล้างเนื้อหาเก่าแล้วแสดง textarea พร้อมรูปเดิม
            postContent.innerHTML = '';
            postContent.appendChild(textArea);
            if (imageSpan) {
                postContent.appendChild(imageSpan); // แสดงรูปภาพเดิม
            }

            // สร้างปุ่ม Save และ Cancel
            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';

            const div = document.createElement('div');
            postContent.appendChild(div);

            div.appendChild(saveButton);
            div.appendChild(cancelButton);

            // Event สำหรับบันทึกการแก้ไข
            saveButton.addEventListener('click', () => {
                const newText = textArea.value.trim();
                postContent.innerHTML = `${newText} `;
                if (imageSpan) {
                    postContent.appendChild(imageSpan); // คงรูปภาพไว้
                }
            });

            // Event สำหรับยกเลิกการแก้ไข
            cancelButton.addEventListener('click', () => {
                postContent.innerHTML = `${textContent} `;
                if (imageSpan) {
                    postContent.appendChild(imageSpan); // คงรูปภาพไว้
                }
            });
            
        }
    })
    // ลบPOST
    postContainer.addEventListener('click', function(event) {
        // ตรวจสอบว่าปุ่มที่ถูกคลิกเป็นปุ่ม "Delete"
        if (event.target.classList.contains('deletePost')) {
            event.stopPropagation(); // ป้องกันการปิดเมนูถ้าคลิกที่ Delete
            
            // ค้นหา <li> แม่ของปุ่ม "Delete"
            const postLi = event.target.closest(".post").parentElement;
            if (postLi) {
                postLi.remove(); // ลบ <li> ที่เป็นโพสต์
            }
        }
    });


    // แก้ไขComment
    postContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('editComment')) {
            event.stopPropagation();
    
            // ดึงองค์ประกอบที่ต้องการแก้ไข
            const commentElement = event.target.closest('.headerComment');
            const commentContent = commentElement.nextElementSibling; // เลือก .mainComment ที่อยู่ถัดไป
    
            // เก็บข้อความต้นฉบับ
            const textContent = commentContent.textContent.trim();
    
            // สร้าง textarea สำหรับแก้ไข
            const textArea = document.createElement('textarea');
            textArea.value = textContent;
            textArea.classList.add('editTextarea');
    
            // ล้างเนื้อหาเก่าแล้วแสดง textarea
            commentContent.innerHTML = '';
            commentContent.appendChild(textArea);
    
            // สร้างปุ่ม Save และ Cancel
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('commentButtonGroup');
    
            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.classList.add('saveButton');
    
            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.classList.add('cancelButton');
    
            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(cancelButton);
            commentContent.appendChild(buttonContainer);
    
            // Event สำหรับบันทึกการแก้ไข
            saveButton.addEventListener('click', () => {
                const newText = textArea.value.trim();
                commentContent.innerHTML = newText;
            });
    
            // Event สำหรับยกเลิกการแก้ไข
            cancelButton.addEventListener('click', () => {
                commentContent.innerHTML = textContent;
            });
        }
    });
    // ลบComment
    postContainer.addEventListener('click', function(event){
        if(event.target.classList.contains('deleteComment')){
            event.stopPropagation();
            
            const CommentLi = event.target.closest(".headerComment").parentElement;
            if(CommentLi){
                CommentLi.remove();
            }
        }
    })

});
