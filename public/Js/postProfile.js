document.addEventListener('DOMContentLoaded', () => {
    const displayPost = document.getElementById('displayPost');
    const postProfiles = document.querySelectorAll('.postProfile'); // ใช้ querySelectorAll เพื่อรองรับหลายภาพ

    // สำหรับทุกภาพที่เป็น postProfile
    postProfiles.forEach(postProfile => {
        postProfile.addEventListener('click', () => {
            const container = document.createElement('div');
            container.id = 'card';
            container.innerHTML = `
                <div class="profile">
                    <img src="https://s359.kapook.com/r/600/auto/pagebuilder/b99c232c-5339-4545-abd8-202b0bb21e6a.jpg">
                </div>
                <div class="bottom">
                    <div class="content">
                        <span class="name">My Name</span>
                        <span class="about-me">ความสนใจ :</span>
                    </div>
                    <span class="button">Namessssssssss</span>
                </div>
            `;
            document.body.appendChild(container);
        });
    });
});
