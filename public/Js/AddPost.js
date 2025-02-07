let selectedImages = [];

document.addEventListener('DOMContentLoaded', async () => {
    const button = document.getElementById('sendpost');
    const idUser = localStorage.getItem('idUser');
    let likes = 0;
    let comments = 0;

    button.addEventListener('click', async (event) => {
        event.preventDefault();

        const input = document.getElementById('postContent');
        const postImageInput = document.getElementById('postImage'); // input for images
        const text = input.innerText.trim();
        const timestamp = Date.now();
        const postTime = formatDateTime(timestamp);

        // If there is no text but the image exists, it should still post
        if (text === "" && postImageInput.files.length === 0) return;

        const formData = new FormData();
        formData.append('text', text);
        formData.append('postTime', postTime);
        formData.append('likes', likes);
        formData.append('comments', comments);
        formData.append('idUser', idUser);

        // Add the image to FormData if exists
        if (postImageInput.files.length > 0) {
            formData.append('image', postImageInput.files[0]);
        }

        try {
            const response = await fetch('/api/addpost', {
                method: 'POST',
                body: formData,  // Send FormData instead of JSON
            });

            if (response.ok) {

            } else {
                alert('Error adding post');
            }
        } catch (error) {
            console.error("Error:", error);
        }

        // Reset form
        input.innerHTML = "";
        postImageInput.value = "";
        window.location.reload();  // Reload the page to show the new post
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
