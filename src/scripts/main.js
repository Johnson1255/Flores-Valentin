let banners = document.querySelectorAll('.banner');
let index = 0;
function rotateBanner() {
    banners.forEach((banner, i) => {
        banner.style.display = (i === index) ? 'block' : 'none';
    });
    index = (index + 1) % banners.length;
}
setInterval(rotateBanner, 3000);
