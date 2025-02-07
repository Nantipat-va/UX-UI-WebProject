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
    postContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('editPost')) {
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
            saveButton.addEventListener('click', async () => {
                const newText = textArea.value.trim();
                const postId = postElement.dataset.postId; // ดึง postID
    
                // ส่งข้อมูลไปยัง server เพื่ออัปเดต
                try {
                    const response = await fetch('/api/update-post', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ postId, content: newText }),
                    });
    
                    if (!response.ok) throw new Error('Failed to update post');
    
                    // หลังอัปเดตสำเร็จ ให้แสดงเนื้อหาที่อัปเดตแล้ว
                    postContent.innerHTML = `${newText} `;
                    if (imageSpan) {
                        postContent.appendChild(imageSpan); // คงรูปภาพไว้
                    }
                } catch (error) {
                    console.error("Error updating post:", error);
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
    });
    
    // ลบโพสต์
    postContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('deletePost')) {
        event.stopPropagation();
        const postLi = event.target.closest(".post").parentElement;
        const postId = postLi.dataset.postId;

        console.log(postId)

        if (postLi) {
            console.log("Sending delete request for post ID:", postId);
            fetch(`/api/delete-post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (response.ok) {
                    console.log("Post deleted successfully");
                    postLi.remove();
                } else {
                    console.error("Failed to delete post");
                }
            })
            .catch(error => console.error("Error deleting post:", error));
        }
    }
});




    // แก้ไขComment
    postContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('editComment')) {
            event.stopPropagation();
    
            const commentElement = event.target.closest('.headerComment');
            const commentContent = commentElement.nextElementSibling;
            const commentId = commentElement.dataset.commentId; // ดึง commentId จาก dataset

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
    
                fetch(`/api/update-comment/${commentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ comment: newText }),
                })
                .then(response => {
                    if (response.ok) {
                        commentContent.innerHTML = newText;
                        console.log('Comment updated successfully');
                    } else {
                        console.error('Failed to update comment');
                    }
                })
                .catch(error => console.error('Error updating comment:', error));
            });
    
            // Event สำหรับยกเลิกการแก้ไข
            cancelButton.addEventListener('click', () => {
                commentContent.innerHTML = textContent;
            });
        }
    });
    
    // ลบComment
    postContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('deleteComment')) {
            event.stopPropagation();
    
            // ค้นหา Comment ที่จะลบ
            const commentLi = event.target.closest(".headerComment").parentElement;
            const commentId = event.target.closest('.headerComment').dataset.commentId;
    
            if (commentLi) {
                // ส่งคำขอลบไปยังเซิร์ฟเวอร์
                fetch(`/api/delete-comment/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    if (response.ok) {
                        commentLi.remove(); // ลบออกจากหน้าเว็บ
                        console.log("Comment deleted successfully");
                    } else {
                        console.error("Failed to delete comment");
                    }
                })
                .catch(error => console.error("Error deleting comment:", error));
            }
        }
    });
    

});
