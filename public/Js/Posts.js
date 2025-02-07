document.addEventListener('DOMContentLoaded', async () => {
    const postList = document.getElementById('displayPost');

    try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');

        const posts = await response.json();

        // สำหรับแต่ละโพสต์
        for (const post of posts) {
            const newPost = createPostElement(post);
            postList.appendChild(newPost);

            // ดึงคอมเมนต์ที่เกี่ยวข้องกับโพสต์นี้
            const commentsResponse = await fetch(`/api/comments/${post.postID}`);
            if (!commentsResponse.ok) throw new Error('Failed to fetch comments');

            const comments = await commentsResponse.json();

            // สำหรับแต่ละคอมเมนต์ในโพสต์นี้
            comments.forEach(comment => {
                const {idComment, content, commentTime, timestamp, username, idUser } = comment;
                const newComment = createCommentElement(idComment, content, commentTime, timestamp, username, idUser);
                // หาตัว ul.displayComment ภายในโพสต์นี้และเพิ่มคอมเมนต์
                const displayComment = newPost.querySelector('.displayComment');
                displayComment.appendChild(newComment);
            });
        }

    } catch (error) {
        console.error("Error loading posts or comments:", error);
    }
});

// ฟังก์ชันสร้าง DOM สำหรับโพสต์แต่ละรายการ
function createPostElement(post) {
    const { username, content, Img, postTime, likes, comments, idUser, postID } = post;
    const timestamp = new Date(postTime).getTime();
    const postContent = content || '';
    const profileImage = `/api/user-image/${idUser}`;

    // คำนวณเวลาที่ผ่านไปจาก postTime
    const timePassed = timeAgo(postTime); // ใช้ฟังก์ชัน timeAgo ที่เราได้เขียนไว้

    const newPost = document.createElement('li');
    newPost.dataset.postId = postID;
    newPost.innerHTML = `
        <div class="post" data-post-id="${postID}">
            <div class="headerPost">
                <img src="${profileImage}" alt="" class="postProfile" id="profileImg-${idUser}">
                <div class="group">
                    <span class="name">${username}</span>
                    <span class="postTimer" data-time="${timestamp}">${timePassed}</span> <!-- แสดงเวลาผ่านไป -->
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
                    ${postContent}
                    ${Img ? `<img src="${Img}" alt="Post Image" class="postImage">` : ''}
                </p>
            </div>
            <div class="footer">
                <span>Like: ${likes}</span>
                <span>Comment: ${comments}</span>
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
    return newPost;
}

// ฟังก์ชันสร้าง DOM สำหรับคอมเมนต์
function createCommentElement(idComment, text, commentTime, timestamp, username, idUser) {
    const profileImage = `/api/user-image/${idUser}`;

    const newComment = document.createElement('li');
    newComment.dataset.commentId = idComment;
    newComment.innerHTML = `
        <div class="headerComment" data-comment-id="${idComment}">
            <img src="${profileImage}" alt="" class="postProfile" id="profileImg-${idUser}">
            <div class="group">
                <span class="name">${username}</span>
                <span class="commentTimer" data-time="${timestamp}">${timeAgo(commentTime)}</span> <!-- แสดงเวลาผ่านไป -->
            </div>
            <div class="fixComment">
                <i class="toggleFixComment">. . .</i>
                <ul class="menuFixComment">
                    <li class="editComment">Edit</li>
                    <li class="deleteComment">Delete</li>
                </ul>
            </div>
        </div>
        <div class="mainComment">
            ${text}
        </div>
    `;
    return newComment;
}

// ฟังก์ชันแปลงเวลาที่ผ่านไปจาก commentTime
function timeAgo(dateString) {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        return `${diffInMinutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600);
        return `${diffInHours} hours ago`;
    } else if (diffInSeconds < 2592000) {
        const diffInDays = Math.floor(diffInSeconds / 86400);
        return `${diffInDays} days ago`;
    } else if (diffInSeconds < 31536000) {
        const diffInMonths = Math.floor(diffInSeconds / 2592000);
        return `${diffInMonths} months ago`;
    } else {
        const diffInYears = Math.floor(diffInSeconds / 31536000);
        return `${diffInYears} years ago`;
    }
}
