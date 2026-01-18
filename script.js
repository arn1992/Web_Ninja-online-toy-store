document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Optional: Add a subtle animation to product cards on scroll
    const productCards = document.querySelectorAll('.product-card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.5s ${entry.target.dataset.delay || '0s'} forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    productCards.forEach((card, index) => {
        card.style.opacity = '0'; // Hide cards initially
        card.dataset.delay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the href is more than just '#'
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();

                try {
                    const targetElement = document.querySelector(this.getAttribute('href'));
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                } catch (error) {
                    // In case of an invalid selector, do nothing to avoid crashing.
                    console.error('Invalid selector for smooth scroll:', this.getAttribute('href'));
                }
            }
        });
    });
});

// Add CSS for the animation in a style tag to avoid needing another file
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(style);