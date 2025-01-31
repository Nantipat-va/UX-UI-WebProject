let selectedImages = [];

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('sendpost');

    button.addEventListener('click', (event) => {
        event.preventDefault();

        const input = document.getElementById('postContent');
        const postlist = document.getElementById('displayPost');

        const text = input.innerText.trim();

        if (text === "" && selectedImages.length === 0) return;

        const timestamp = Date.now();

        const imagesHTML = selectedImages.map(url => `<img src="${url}" alt="Post Image" >`).join('');

        const newPost = document.createElement('li');
        newPost.innerHTML = `
            <div class="post">
                <div class="headerPost">
                    <img src="../../iconlike/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg" alt="" class = "postProfile">
                    <div class="group">
                        <span class="name">Nantipat Wayubut</span>
                        <span class="postTimer" data-time="${timestamp}">Just now</span>
                    </div>
                    <div class="fixPost">
                        <i class="fa-solid fa-wrench toggleFixPost"></i>
                        <ul class="menuFixpost">
                            <li class="editPost">Edit</li>
                            <li class="deletePost">Delete</li>
                        </ul>
                    </div>
                </div>
                
                <div class="mainContent">
                    <p>
                        ${text}
                        <span>${imagesHTML}</span>
                    </p>
                </div>
                <div class="footer">
                    <span>Like:0</span>
                    <span>Comment:0</span>
                </div>
            </div>
            <div class="comment">
                <h2>Comment</h2>
                <ul class="displayComment"></ul>
                <div class="inputCommentBox">
                    <input type="text" placeholder="comment. . ." class="inputComment">
                    <button class="sendComment">Send</button>
                </div>
            </div>`;

        postlist.appendChild(newPost);

        input.innerText = "";
        selectedImages = [];
        document.getElementById('postImage').value = "";


        const timerElement = newPost.querySelector(".postTimer");
            if (timerElement) {
                updateSingleCommentTimer(timerElement);
            }
    });

    // ฟังก์ชันคำนวณเวลาใหม่ของpost
    function updateSingleCommentTimer(timer) {
        setInterval(() => {
            const postTime = parseInt(timer.getAttribute("data-time"), 10);
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - postTime) / 1000);

            let timeText = "Just now";
            if (elapsedTime >= 60) {
                const minutes = Math.floor(elapsedTime / 60);
                timeText = `${minutes} minute${minutes > 1 ? "s" : ""}  ago`;
            } else if (elapsedTime > 0) {
                timeText = `${elapsedTime} second${elapsedTime > 1 ? "s" : ""} ago`;
            }

            timer.textContent = timeText;
        }, 10000);
    }
});