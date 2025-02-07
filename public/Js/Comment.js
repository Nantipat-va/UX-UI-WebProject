document.addEventListener('DOMContentLoaded', () => {
    const postContainer = document.getElementById("displayPost");
    const idUser = localStorage.getItem('idUser');

    // ใช้ event delegation สำหรับการคลิกที่ปุ่ม sendComment
    postContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains("sendComment")) {
            event.preventDefault(); // ป้องกันการส่งฟอร์ม (ถ้ามี)

            // ค้นหา parent ที่ใกล้ที่สุด (div.comment)
            const commentBox = event.target.closest(".comment");
            const postElement = event.target.closest('li').querySelector('.post');

            // console.log("commentBox:",commentBox);
            console.log("postElement:",postElement);

            const Id = postElement.dataset.postId;
            // console.log("postId:",postId)
            
            const timestamp = Date.now();
            const commentTime = formatDateTime(timestamp);

            // ดึง input และ ul ที่อยู่ภายในโพสต์เดียวกัน
            const input = commentBox.querySelector(".inputComment");
            const commentList = commentBox.querySelector(".displayComment");

            const text = input.value.trim();
            if (text === "") return;

            const formData = {
                content: text,
                commentTime: commentTime,
                postId: Id,
                idUser: idUser,
            };

            try {
                const response = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                

                if (!response.ok) throw new Error('Failed to add comment');

                const newComment = await response.json();

                window.location.reload();
                // ล้างค่าช่อง input
                input.value = "";
                
            } catch (error) {
                console.error("Error adding comment:", error);
            }

        }
    });


    function formatDateTime(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
});