const postbox = document.getElementById('containnerInputPost');
const inputPost = document.getElementById('postContent');
const sendPost = document.getElementById('sendpost');


inputPost.addEventListener('focus', () => {
    postbox.classList.add('active');
    inputPost.classList.add('active');
});
inputPost.addEventListener('blur', () => {
    postbox.classList.remove('active');
    inputPost.classList.remove('active');
});
