document.addEventListener('DOMContentLoaded', () =>{
    const frameSetting = document.querySelector(".frame");
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        frameSetting.style.transform = "translateY(0px)";
      });
})