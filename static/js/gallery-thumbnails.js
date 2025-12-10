//query selectors

const galleryActive = document.querySelector('.gallery-active');
const thumbnails = document.querySelectorAll('.thumbnail');
let activeImage;
//auto rotation function





//set active function
function updateActiveImage(img) {
   thumbnails.forEach(img => {
        img.classList.remove('active');
   });
    img.classList.add('active');
}


//event listeners
thumbnails.forEach(img => {
    img.addEventListener('click', function() {
        updateActiveImage(img);
    });
    
});