// Navigation scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Live Clock and Calendar with Location Detection
class TimeWidget {
    constructor() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.dateDisplay = document.getElementById('dateDisplay');
        this.locationText = document.getElementById('locationText');
        this.userLocation = null;
        this.init();
    }

    init() {
        this.updateTime();
        this.detectLocation();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        
        // Format time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        this.timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        
        // Format date
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZoneName: 'short'
        };
        this.dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }

    detectLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.fetchLocationName(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.log('Geolocation error:', error);
                    this.locationText.textContent = 'Location unavailable';
                }
            );
        } else {
            this.locationText.textContent = 'Geolocation not supported';
        }
    }

    async fetchLocationName(lat, lon) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
            );
            const data = await response.json();
            
            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || '';
                const state = data.address.state || data.address.region || '';
                const country = data.address.country || '';
                
                let locationString = '';
                if (city && state) {
                    locationString = `${city}, ${state}`;
                } else if (city) {
                    locationString = city;
                } else if (state) {
                    locationString = state;
                }
                
                if (country && locationString) {
                    locationString += `, ${country}`;
                } else if (country) {
                    locationString = country;
                }
                
                this.locationText.textContent = locationString || 'Unknown location';
            } else {
                this.locationText.textContent = 'Unknown location';
            }
        } catch (error) {
            console.log('Error fetching location:', error);
            this.locationText.textContent = 'Location unavailable';
        }
    }
}

// Initialize time widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimeWidget();
});

// Active navigation link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});
