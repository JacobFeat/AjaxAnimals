const users = document.querySelector('.users');
// XHR
const btn = document.querySelector('.btn');

let imgs = document.querySelectorAll('.users img');
let dogName = document.querySelector('.dog-name');

let currentIndex = 0;
let output = '';
let dogs = [];
let imgLengthSpan = document.querySelector('.length-img');
let imgCurrentSpan = document.querySelector('.current-img');

function loadData() {
    for (let i = 0; i < 4; i++) {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", "https://dog.ceo/api/breeds/image/random", true);

        xhr.responseType = 'json';
        xhr.addEventListener('load', e => {
            if (xhr.status === 200) {
                const dog = xhr.response;
                dogs.push(dog);
                output += `
                <div class="img-wrapper">
                    <img src='${dog.message}' width="200" height="200">
                    <span class="overlay-img"></span>
                </div>
                `;
                users.innerHTML = output;
                imgs = document.querySelectorAll('.users img');

                imgs.forEach((img, index) => {
                    img.addEventListener('click', () => {
                        showImg(img);
                        showName(img, dogName);
                        currentIndex = index;
                        imgLengthSpan.innerHTML = imgs.length;
                        imgCurrentSpan.innerHTML = index + 1;
                    });
                });
            }
        });

        xhr.addEventListener('error', e => {
            alert("Nie udało się nawiązać połączenia");
        });
        xhr.send();
    }

}

const clickedWrapper = document.querySelector('.clicked-wrapper');
const clickedImg = document.querySelector('.clicked-img');
const clickedActive = document.querySelector('.clicked-img-active');
const layout = document.querySelector('.layout');
const description = document.querySelector('.description');


function showImg(img) {
    clickedImg.src = img.src;
    clickedWrapper.classList.add('clicked-img-active');
    layout.classList.add('layout-active');
    description.style.display = "flex";
    
}

function showName(img, htmlString){
    let cutBegLink = 'breeds/';
    let cutEndLink = '';
    let beginningLink = img.src.indexOf(cutBegLink) + cutBegLink.length;
    let leftLink = img.src.slice(beginningLink);
    let dog = leftLink.slice(0, leftLink.indexOf('/'));
    if (dog.includes('-')) {
        let line = dog.indexOf('-');
        let dogStrain = dog.charAt(0).toUpperCase()+dog.slice(1, line) + ' ' + dog.charAt(line+1).toUpperCase() +  dog.slice(line+2, dog.length);
        dogName.innerHTML = dogStrain;
    }
    else {
        let dogStrain = dog.charAt(0).toUpperCase() + dog.slice(1).toLowerCase();
        dogName.innerHTML = dogStrain;
    }
}

function turnOffGallery() {
    clickedWrapper.classList.remove('clicked-img-active');
    layout.classList.remove('layout-active');
    description.style.display = "none";
}

function slideImg(e) {
    if (e.key === "ArrowLeft" && currentIndex > 0) {
        clickedImg.src = imgs[currentIndex - 1].src;
        currentIndex--;
        imgCurrentSpan.innerHTML = currentIndex + 1;
    }
    if (e.key === "ArrowRight" && currentIndex < imgs.length - 1) {
        clickedImg.src = imgs[currentIndex + 1].src;
        currentIndex++;
        imgCurrentSpan.innerHTML = currentIndex + 1;
    }
    if (e.key === "Escape") {
        turnOffGallery();
    }
}

btn.addEventListener('click', loadData);
document.addEventListener('keydown', slideImg);
layout.addEventListener('click', turnOffGallery);
