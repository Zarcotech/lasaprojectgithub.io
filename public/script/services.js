const homeBtn = document.getElementById('home');
const servicesBtn = document.getElementById('services');
const aboutBtn = document.getElementById('about');
const contactBtn = document.getElementById('contact');
const donateBtn = document.getElementById('donate');

const currentPath = window.location.pathname;

if (currentPath === '/services') {
    servicesBtn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.web-dev');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-webdev');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.web-hosting');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-webhosting');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});
