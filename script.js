'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');


///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal(); 
  }
});



///////////////////////////// Scroll Functionality

// Button scrolling
btnScrollTo.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log('height/width viewport:', document.documentElement.clientHeight, document.documentElement.clientWidth);


  //////////////////// Scrolling
  // window.scrollTo(s1coords.left+window.pageXOffset , s1coords.top + window.pageYOffset)

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset, 
  //   top:  s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({behavior: 'smooth'});
});



////////////////////////////////////////////////////////
/////////////////// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   })
// })

// Note***** The above method is correct but we are attaching the function with each element and if there are lots of similar elements present in our app then it will affect the performance.

// So to overcome this we will do event delegation that means we will add the event listener with the common parent and use bubbling methodology.


/////////////////////////////////////////////////// Event Delegation
// 1.) Add event listener to common parent element
// 2.) Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  // Matching strategy
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});


///////////////////////////// Building Tabbed Component
tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');

  // Guard clause : this is if statement if condition match return early
  if(!clicked) return;

  // Remove Actice Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activae content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


///////////////////////// Menu Fade Animation
// mouseenter enter doesnot bubble

const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

// Passing an "argument" into handler function 
// If we want to pass multiple arguments then we have to pass it in object or an array
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1)); 


///////////////////////////// Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function(){
//   console.log(window.scrollY);
  
//   if(window.scrollY > initialCoords.top){
//     nav.classList.add('sticky');
//   }
//   else{
//     nav.classList.remove('sticky');
//   }
// })


/////////////////////// Sticky Navigation: Intersection Observer API

// Note*** This callback function will get called each time that the target element intersecting root element at the threshold we defined
// Here target element is section1
// Here entries are the array of threshold entries
// const obsCallback = function(entries, observer){
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// }

// const obsOptions = {
//   root: null,
//   threshold: [0,0.2], //This values shows how much the target is present in the view port before and after entering and leaving viewport resp.
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header1 = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries;
  nav.classList.add('sticky');

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,  //This will apply outside the target element
});
headerObserver.observe(header1);


/////////////////////////////////////Revealing Elements on Scroll
const revealSection = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root:null,
  threshold: 0.15
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});


//////////////////////////////////////// Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries,observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px'
});

imgTargets.forEach(function(img){
  imgObserver.observe(img);
});



///////////////////////////// Slider Component

const slider = function(){
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const maxSlide = slides.length;
let currSlide = 0;


// Functions
const createDots = function(){
  slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend', 
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
}

const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide='${slide}']`).classList.add('dots__dot--active');
};


const goToSlide = function(slide){
  slides.forEach((s,i) => s.style.transform = `translateX(${100*(i-slide)}%)`);
}


// move right
const nextSlide = function(){
  if(currSlide === maxSlide-1){
    currSlide = 0;
  } else{
    currSlide++;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
}

// move left
const prevSlide = function(){
  if(currSlide === 0){
    currSlide = maxSlide-1;
  } else{
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
}

const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);
}
init();

// Event Handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide(); //short circuiting
});

dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
};

slider();


///////////////////////////// Selecting, Creating and Deleting 

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));


///////////////////////////// Creating and Inserting elements
// .insertAdjacentHTML to create

const message =  document.createElement('div');
message.classList.add('cookie-message');
// Read and set content
// message.textContent = 'We use cookies to improve functionality and analytics.';
message.innerHTML = 'We use cookies to improve functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

//////////////////// Adding element to DOM


// header.prepend(message); //It will append element as a first child
header.append(message);  ////It will append element as a last child
// header.append(message.cloneNode(true)); //Append at multiple places

// header.before(message);//It will append element as a sibling
// header.after(message);//It will append element as a sibling


//////////////////////Delete element from DOM
document.querySelector('.btn--close-cookie').addEventListener('click', function(){
  message.remove();
  // message.parentElement.removeChild(message);
});


////////////////// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '103.1%';

// We will only get those styles which are set manually inline
console.log(message.style.height);
console.log(message.style.backgroundColor);

// If we want to get styles still we can get by using getComputedStyle
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height)+30+'px';


/////////////////// Custom Property (If we want to change custom property then we have to use setProperty method)
document.documentElement.style.setProperty('--color-primary', 'orangered');


///////////////////// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.getAttribute('src'));
console.log(logo.className);

logo.alt = 'Beautiful Minimalist logo';
logo.setAttribute('company','Bankist');

const link = document.querySelector('.btn--show-modal');
console.log(link.href);
console.log(link.getAttribute('href'));


////////////////////// Data Attributes
console.log(logo.dataset.versionNumber); 


//////////////////// Classes
logo.classList.add('c','j');
logo.classList.remove('c','j');
logo.classList.toggle('c');
logo.classList.contains('c');  //not includes



///////////////////// Types of Events and Event Handlers

// const h1 = document.querySelector('h1');

// const alertH1 = function(e){
//   alert('addEventListener: Great! You are reading heading ');

//   // h1.removeEventListener('mouseenter', alertH1);
// }

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
// },3000);

// Old school way to kisten event
// h1.onmouseenter = function(e){
//   alert('addEventListener: Great! You are reading heading ');
// }



/////////////////////////// Bubbling And Capturing
// JS events has very important property
// bubbling phase and capturing phase
// Event propogate from capturing phase to target phase and then bubbling phase through parents not siblings.



//////////////////////////// Event Propogation in Practice


// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click',function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);

//   ///////////////////////////// Stop Propagation
//   // e.stopPropagation();
// })

// document.querySelector('.nav__links').addEventListener('click',function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// })

// document.querySelector('.nav').addEventListener('click',function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// },true)  ///////////////////////If we want to know about the capturing phase then we have to pass 3rd parameter, by default it is set to false 




// Event Delegation
// We will us the power of bubbling to delegate event



/////////////////////// DOM Traversing

const newH1 = document.querySelector('h1');

// Going downwards: child
console.log(newH1.querySelectorAll('.highlight'));
console.log(newH1.childNodes);
console.log(newH1.children);  /////This one only work for direct children
newH1.firstElementChild.style.color = 'white';
newH1.lastElementChild.style.color = 'orangered';


// Going upwards: parents
console.log(newH1.parentNode); 
console.log(newH1.parentElement); //////////Direct Parent

// Getting parent which is not the direct parent
// newH1.closest('.header').style.background = 'var(--gradient-secondary)';


// Going sidewards: siblings
console.log(newH1.previousElementSibling);
console.log(newH1.nextElementSibling);

console.log(newH1.previousSibling);
console.log(newH1.nextSibling);

console.log(newH1.parentElement.children);
[...newH1.parentElement.children].forEach(function(el){
  if(el !== newH1){
    el.style.transform = 'scale(0.5)';
  }
});


// Lifecycle DOM Events

document.addEventListener('DOMContentLoaded', function(e){
  console.log('HTML parsed and DOM tree bult!',e);
});


window.addEventListener('load', function(e){
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function(e){
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });


/////////////////////////Script Loading Async and Defer
// Note*** Whenever you put script tag in head use above mentioned attribute to load script perfectly.
































