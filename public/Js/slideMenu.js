const check = document.getElementById('checkbox');
const menu = document.getElementById('menu');

// กำหนดการแสดงและซ่อนเมนูเมื่อคลิกที่ checkbox
check.addEventListener('click', function (event) {
    event.stopPropagation();
    if (this.checked) {
        menu.style.transform = 'translateX(45px)';
    } else {
        menu.style.transform = 'translateX(400px)';
    }
});

