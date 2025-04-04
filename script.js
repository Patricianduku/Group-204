// Initialize AOS animation library
AOS.init({
    duration: 1000,
    once: true,
    mirror: false
});

document.addEventListener('DOMContentLoaded', function() {
    // Typing animation effect for hero section
    const typingText = document.querySelector('.typing-text');
    if(typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        typeWriter();
    }

    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-animation');
    const animateProgressBars = () => {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 300);
        });
    };

    // Trigger progress bar animation when scrolled into view
    const languagesSection = document.getElementById('languages');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                observer.unobserve(entry.target);
            }
        });
    });
    
    if (languagesSection) {
        observer.observe(languagesSection);
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu after click
            if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Project filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide project items based on filter
                document.querySelectorAll('.project-item').forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Contact form submission via AJAX
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Show loading status
            formStatus.innerHTML = '<p class="loading">Sending message...</p>';
            
            // Send form data to server
            fetch('submit_contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formStatus.innerHTML = '<p class="success">Message sent successfully!</p>';
                    contactForm.reset();
                } else {
                    formStatus.innerHTML = '<p class="error">Failed to send message. Please try again.</p>';
                }
                
                // Clear status message after 3 seconds
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 3000);
            })
            .catch(error => {
                formStatus.innerHTML = '<p class="error">An error occurred. Please try again later.</p>';
                console.error('Error:', error);
                
                // Clear status message after 3 seconds
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 3000);
            });
        });
    }

    // Load projects from database
    loadProjects();
    
    // Load education data from database
    loadEducation();
});

// Function to load projects from database
function loadProjects() {
    fetch('get_projects.php')
        .then(response => response.json())
        .then(projects => {
            const projectContainer = document.getElementById('project-container');
            if (!projectContainer) return;
            
            projectContainer.innerHTML = '';
            
            projects.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.className = `project-item ${project.category}`;
                projectItem.setAttribute('data-aos', 'fade-up');
                
                projectItem.innerHTML = `
                    <img src="${project.image}" alt="${project.title} image">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-links">
                        ${project.demo_link ? `<a href="${project.demo_link}" class="btn btn-sm" target="_blank">Demo</a>` : ''}
                        ${project.github_link ? `<a href="${project.github_link}" class="btn btn-sm" target="_blank">GitHub</a>` : ''}
                    </div>
                `;
                
                projectContainer.appendChild(projectItem);
            });
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            // Fallback to static content if database fetch fails
            document.getElementById('project-container').innerHTML = `
                <!-- Project 1 -->
                <div class="project-item web" data-aos="fade-up">
                    <img src="project1.jpg" alt="Project 1 image">
                    <h3>Project 1</h3>
                    <p>This is an online quiz platform that uses HTML for the structure, 
                        CSS for styling, and JavaScript for dynamic interaction and scoring. 
                        Users can take quizzes, see their scores, and even view explanations 
                        for each answer based on their responses.</p>
                </div>
                <!-- Project 2 -->
                <div class="project-item web" data-aos="fade-up" data-aos-delay="100">
                    <img src="project2.webp" alt="Project 2 image">
                    <h3>Project 2</h3>
                    <p>This is an e-book reader app that allows users to read books online. 
                        HTML structures the book content, CSS styles the book layout and pages, 
                        and JavaScript adds interactive elements like bookmarks, page flipping animations, and a search feature.</p>
                </div>
                <!-- Project 3 -->
                <div class="project-item web" data-aos="fade-up" data-aos-delay="200">
                    <img src="project 3.png" alt="Project 3 image">
                    <h3>Project 3</h3>
                    <p>A tool that helps users track their income and expenses. 
                        HTML outlines the budget form and records, CSS styles the planner, 
                        and JavaScript handles the calculations and graphs showing financial health.</p>
                </div>
                <!-- Project 4 -->
                <div class="project-item design" data-aos="fade-up" data-aos-delay="300">
                    <img src="poster.png" alt="image of a poster">
                    <h3>Project 4</h3>
                    <p>I design posters, flyers, banners etc for various businesses and this is one of the many pieces. 
                        I love experimenting with different styles and techniques incorporating AI, 
                        always aiming to create something unique and eye-catching.</p>
                </div>
            `;
        });
}

// Function to load education data from database
function loadEducation() {
    fetch('get_education.php')
        .then(response => response.json())
        .then(educationItems => {
            const educationList = document.getElementById('education-list');
            if (!educationList) return;
            
            educationList.innerHTML = '';
            
            educationItems.forEach(item => {
                const educationItem = document.createElement('p');
                educationItem.textContent = `${item.institution} (${item.start_date} - ${item.end_date}) - ${item.degree}`;
                educationList.appendChild(educationItem);
            });
        })
        .catch(error => {
            console.error('Error loading education data:', error);
            // Keep existing static content if database fetch fails
        });
}