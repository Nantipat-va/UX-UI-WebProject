const postContent = document.getElementById('postContent');

postContent.addEventListener('paste', (event) => {
    // ป้องกันพฤติกรรมปกติของการ paste
    event.preventDefault();

    // ดึงข้อมูลจาก clipboard
    const text = event.clipboardData.getData('text/plain');

    // แทรกเฉพาะข้อความที่ถูกคัดลอกมา
    document.execCommand('insertText', false, text);
});


