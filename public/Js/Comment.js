document.addEventListener('DOMContentLoaded', () => {
    const postContainer = document.getElementById("displayPost");

    // ใช้ event delegation สำหรับการคลิกที่ปุ่ม sendComment
    postContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains("sendComment")) {
            event.preventDefault(); // ป้องกันการส่งฟอร์ม (ถ้ามี)

            // ค้นหา parent ที่ใกล้ที่สุด (div.comment)
            const commentBox = event.target.closest(".comment");

            // ดึง input และ ul ที่อยู่ภายในโพสต์เดียวกัน
            const input = commentBox.querySelector(".inputComment");
            const commentList = commentBox.querySelector(".displayComment");

            const text = input.value.trim();
            if (text === "") return;

            // ดึง timestamp ปัจจุบัน (เวลาที่โพสต์)
            const timestamp = Date.now();

            // สร้าง li ใหม่
            const newComment = document.createElement('li');
            newComment.innerHTML = `
                <div class="headerComment">
                    <img src="../../iconlike/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg" alt="">
                    <div class="group">
                        <span class="name">Nantipat Wayubut</span>
                        <span class="commentTimer" data-time="${timestamp}">Just now</span>
                    </div>
                    <div class="fixComment">
                        <i class="toggleFixComment">. . .</i>
                        <ul class="menuFixComment">
                            <li class = "editComment">Edit</li>
                            <li class = "deleteComment" >Delete</li>
                        </ul>
                    </div>
                </div>
                <div class="mainComment">
                    ${text}
                </div>
            `;

            // เพิ่มเข้าไปใน ul ของโพสต์ที่กดปุ่ม
            commentList.appendChild(newComment);

            // ล้างค่าช่อง input
            input.value = "";

            // ตรวจสอบว่า .commentTimer มีอยู่จริงก่อนอัปเดตเวลา
            const timerElement = newComment.querySelector(".commentTimer");
            if (timerElement) {
                updateSingleCommentTimer(timerElement);
            }
        }
    });

    // ฟังก์ชันคำนวณเวลาใหม่ของคอมเมนต์เดียว
    function updateSingleCommentTimer(timer) {
        setInterval(() => {
            const postTime = parseInt(timer.getAttribute("data-time"), 10);
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - postTime) / 1000); // แปลงเป็นวินาที

            let timeText = "Just now";
            if (elapsedTime >= 60) {
                const minutes = Math.floor(elapsedTime / 60);
                timeText = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
            } else if (elapsedTime > 0) {
                timeText = `${elapsedTime} second${elapsedTime > 1 ? "s" : ""} ago`;
            }

            timer.textContent = timeText;
        }, 10000); // อัปเดตทุก 10 วินาที
    }
});
