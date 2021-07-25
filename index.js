const users = document.querySelector('.users');
// XHR
const btn = document.querySelector('.btn');
const getStartedBtn = document.querySelector('.get-started-btn');
const aboutMeBtn = document.querySelector('.about-me-btn');
const heroBtns = document.querySelector('.hero-btns-wrapper');
const arrowsWrapper = document.querySelector('.arrows-wrapper');


let imgs = document.querySelectorAll('.users img');
let dogName = document.querySelector('.dog-name');

let currentIndex = 0;
let output = '';
let dogs = [];
let imgLengthSpan = document.querySelector('.length-img');
let imgCurrentSpan = document.querySelector('.current-img');

const article = document.querySelector('article');

let isClicked = false;

function turnOnData() {
    let enjoyText = document.createElement('h2');
    enjoyText.innerHTML = "ENJOY!";
    article.insertBefore(enjoyText, article.querySelector('.container'));
    loadData(true);
    setTimeout(() => {
        enjoyText.classList.add('fade-in-active');
        users.classList.add('fade-in-active');
        getStartedBtn.removeEventListener('click', turnOnData);
    }, 300);
    isClicked = true;

    buttonsAnimation();
}

function buttonsAnimation(){
    if(getComputedStyle(heroBtns).flexDirection === "column"){
        let positionBtnDiffX = getStartedBtn.getBoundingClientRect().x-aboutMeBtn.getBoundingClientRect().x;
        let positionBtnDiffY = getStartedBtn.getBoundingClientRect().y-aboutMeBtn.getBoundingClientRect().y;
        aboutMeBtn.style.transform = `translate(${positionBtnDiffX}px, ${positionBtnDiffY}px)`;
        getStartedBtn.style.transform = `translate(${-positionBtnDiffX}px, ${-positionBtnDiffY}px)`;
    }
        setTimeout(()=> {
            getStartedBtn.classList.add('get-started-btn-fold');
            setTimeout(()=>{
                arrowsWrapper.classList.add('arrows-wrapper-expand');
            }, 300)
        }, 350);
}

function showLoadMoreBtn() {
    if (isClicked)
        btn.style.display = "block";
}

function getGridData(){
    const gridComputedStyle = window.getComputedStyle(users);

    let numberOfColumns = gridComputedStyle.getPropertyValue('grid-template-columns').split(" ").length;

    return numberOfColumns;
}


function loadData(isGetStarted = false) {
    let amountOfImages = getGridData();

    for (let i = 0; i < amountOfImages; i++) {
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
                    <span class="overlay-img">
                        <p class="overlay-text"> </p>
                    </span>
                </div>
                `;
                users.innerHTML = output;
                imgs = document.querySelectorAll('.users img');

                imgs.forEach((img, index) => {
                    img.addEventListener('mouseenter', ()=>{
                        let overlayTexts = document.querySelectorAll('.overlay-text');
                        overlayTexts.forEach(text => {
                                showName(img, text);
                        })
                    });
                    img.addEventListener('mouseout', () => {
                        let overlayTexts = document.querySelectorAll('.overlay-text');
                        overlayTexts.forEach(text => {
                            text.innerHTML = "";
                        })
                    })
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
    if (isGetStarted !== true){
        setTimeout(() => {
            window.scrollTo({
                top: document.body.offsetHeight,
                left: 0,
                behavior: 'smooth',
            });
        }, 300);
    }

}


function hoverName(img, eleToChange){
    let cutBegLink = 'breeds/';
    let beginningLink = img.src.indexOf(cutBegLink) + cutBegLink.length;
    let leftLink = img.src.slice(beginningLink);
    let dog = leftLink.slice(0, leftLink.indexOf('/'));
    if (dog.includes('-')) {
        let line = dog.indexOf('-');
        let dogStrain = dog.charAt(0).toUpperCase() + dog.slice(1, line) + ' ' + dog.charAt(line + 1).toUpperCase() + dog.slice(line + 2, dog.length);
        console.log(dogStrain);
    }
    else {
        let dogStrain = dog.charAt(0).toUpperCase() + dog.slice(1).toLowerCase();
        console.log(dogStrain);
    }
}

const clickedWrapper = document.querySelector('.clicked-wrapper');
const clickedImg = document.querySelector('.clicked-img');
const clickedActive = document.querySelector('.clicked-img-active');
const layout = document.querySelector('.layout');
const layoutChildren = document.querySelectorAll('.layout > *');

function showImg(img) {
    clickedImg.src = img.src;
    clickedWrapper.classList.add('clicked-img-active');
    layout.classList.add('layout-active');
    layoutChildren.forEach(child => child.style.display = "inline-block");

}

function showName(img, eleToChange) {
    let cutBegLink = 'breeds/';
    let beginningLink = img.src.indexOf(cutBegLink) + cutBegLink.length;
    let leftLink = img.src.slice(beginningLink);
    let dog = leftLink.slice(0, leftLink.indexOf('/'));
    if (dog.includes('-')) {
        let line = dog.indexOf('-');
        let dogStrain = dog.charAt(0).toUpperCase() + dog.slice(1, line) + ' ' + dog.charAt(line + 1).toUpperCase() + dog.slice(line + 2, dog.length);
        eleToChange.innerHTML = dogStrain;
    }
    else {
        let dogStrain = dog.charAt(0).toUpperCase() + dog.slice(1).toLowerCase();
        eleToChange.innerHTML = dogStrain;
    }
}



function turnOffGallery() {
    clickedWrapper.classList.remove('clicked-img-active');
    layout.classList.remove('layout-active');
    layoutChildren.forEach(child => child.style.display = "none");
}

function slideImg(e) {
    if (e.key === "ArrowLeft" && currentIndex > 0) {
        clickedImg.src = imgs[currentIndex - 1].src;
        currentIndex--;
        imgCurrentSpan.innerHTML = currentIndex + 1;
        showName(imgs[currentIndex], dogName);
    }
    if (e.key === "ArrowRight" && currentIndex < imgs.length - 1) {
        clickedImg.src = imgs[currentIndex + 1].src;
        currentIndex++;
        imgCurrentSpan.innerHTML = currentIndex + 1;
        showName(imgs[currentIndex], dogName);
    }
    if (e.key === "Escape") {
        turnOffGallery();
    }
}

function testIMGS(){

}

window.addEventListener('resize', getGridData)
window.addEventListener('scroll', showLoadMoreBtn);
getStartedBtn.addEventListener('click', turnOnData);
btn.addEventListener('click', loadData);
document.addEventListener('keydown', slideImg);
layout.addEventListener('click', turnOffGallery);
