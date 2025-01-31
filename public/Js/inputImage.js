function insertImage(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const postContent = document.getElementById("postContent");

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.maxWidth = "40%";
            img.style.height = "auto";

            postContent.appendChild(img);

            selectedImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}