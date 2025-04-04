// Animate elements on scroll
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Element is in view:', entry.target);
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

animatedElements.forEach(element => {
    observer.observe(element);
});