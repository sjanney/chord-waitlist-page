// Email Section Visibility Control
const SHOW_EMAIL_SECTION = true; // Set to false to hide the email section completely

// Military Time Display
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours} : ${minutes} : ${seconds} ${hours >= 12 ? 'PM' : 'AM'}`;
    
    const timeDisplay = document.getElementById('time-display');
    timeDisplay.textContent = timeString;
}

// Update time every second
setInterval(updateTime, 1000);
updateTime(); // Initial call

// Current Date Display
function updateDate() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of year
    const dateString = `${month}.${day}.${year}`;
    
    const dateElement = document.querySelector('.date');
    dateElement.textContent = `${dateString} - `;
}

// Update date when page loads
updateDate();

// Hide email section if SHOW_EMAIL_SECTION is false
function initializeEmailSection() {
    if (!SHOW_EMAIL_SECTION) {
        const emailSection = document.getElementById('email-section');
        if (emailSection) {
            emailSection.style.display = 'none';
            console.log('📧 Email section hidden by SHOW_EMAIL_SECTION setting');
        }
    }
}

// Supabase Configuration
let SUPABASE_CONFIGURED = false;

// Load configuration from environment variables
async function loadConfig() {
    try {
        console.log('🔧 Loading configuration from environment variables...');
        
        // Check if Supabase is configured via server endpoint
        const response = await fetch('/api/config');
        const config = await response.json();
        
        SUPABASE_CONFIGURED = config.hasSupabase;
        
        console.log('✅ Configuration loaded:', {
            hasSupabase: SUPABASE_CONFIGURED
        });
        
        return {
            hasSupabase: SUPABASE_CONFIGURED
        };
    } catch (error) {
        console.error('❌ Failed to load configuration:', error);
        // Fallback to local mode
        SUPABASE_CONFIGURED = false;
        return {
            hasSupabase: false
        };
    }
}

// Initialize Supabase API
function initSupabaseAPI() {
    return new Promise(async (resolve, reject) => {
        try {
            // Load configuration first
            await loadConfig();
            
            // Check if Supabase is configured
            if (!SUPABASE_CONFIGURED) {
                const error = 'Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.';
                console.error('❌', error);
                reject(new Error(error));
                return;
            }
            
            console.log('✅ Supabase API ready');
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// Add entry to Supabase
async function addToSupabase(name, email) {
    try {
        console.log('🌐 Making Supabase API call...');
        
        const response = await fetch('/api/submit-waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit to database');
        }
        
        const result = await response.json();
        console.log('✅ Successfully added to Supabase:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Supabase API Error:', error);
        throw error;
    }
}

// Email Form Handling
async function handleFormSubmission() {
    console.log('🚀 Form submission started');
    
    // Check if email section is enabled
    if (!SHOW_EMAIL_SECTION) {
        console.log('📧 Form submission blocked - email section is disabled');
        return;
    }
    
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const emailSection = document.getElementById('email-section');
    const goodbyeMessage = document.getElementById('goodbye-message');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    
    console.log('📝 Form data:', { name, email });
    
    if (name && email) {
        console.log('✅ Form validation passed, sending to Supabase...');
        
        try {
            // Add to Supabase database
            const result = await addToSupabase(name, email);
            
            if (result.success) {
                console.log('✅ Entry added to Supabase successfully:', { name, email });
            } else {
                console.error('❌ Failed to add entry to Supabase');
            }
        } catch (error) {
            console.error('💥 Supabase API Error:', error);
            console.error('💥 Error message:', error.message);
            
            // Show user-friendly error message
            alert('Sorry, there was an error submitting your information. Please check your internet connection and try again.');
            return; // Don't proceed with UI transition if there's an error
        }
        
        console.log('🎭 Starting UI transition...');
        
        // Hide the email section with a fade effect
        emailSection.style.transition = 'opacity 0.5s ease-out';
        emailSection.style.opacity = '0';
        
        setTimeout(() => {
            emailSection.style.display = 'none';
            
            // Show the goodbye message
            goodbyeMessage.style.opacity = '1';
            console.log('✅ UI transition completed');
        }, 500);
        
        // Clear the inputs
        nameInput.value = '';
        emailInput.value = '';
    } else {
        console.log('❌ Form validation failed - missing name or email');
    }
}

// Add event listeners for form submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize email section visibility first
    initializeEmailSection();
    
    // Only set up form event listeners if email section is enabled
    if (SHOW_EMAIL_SECTION) {
        const nameInput = document.getElementById('name-input');
        const emailInput = document.getElementById('email-input');
        const submitButton = document.getElementById('submit-button');
        
        // Handle Enter key press on either input
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                emailInput.focus();
            }
        });
        
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleFormSubmission();
            }
        });
        
        // Handle submit button click
        submitButton.addEventListener('click', function() {
            handleFormSubmission();
        });
        
        // Handle input focus for better UX
        nameInput.addEventListener('focus', function() {
            this.style.opacity = '1';
        });
        
        nameInput.addEventListener('blur', function() {
            if (!this.value) {
                this.style.opacity = '0.8';
            }
        });
        
        emailInput.addEventListener('focus', function() {
            this.style.opacity = '1';
        });
        
        emailInput.addEventListener('blur', function() {
            if (!this.value) {
                this.style.opacity = '0.8';
            }
        });
    } else {
        console.log('📧 Form event listeners skipped - email section is disabled');
    }
    
    // Initialize Supabase API when page loads
    console.log('🚀 Initializing Supabase API...');
    initSupabaseAPI().then(() => {
        console.log('✅ Supabase API ready for use');
    }).catch((error) => {
        console.error('❌ Failed to initialize Supabase API:', error);
    });
});

// Typing Animation with Multiple Phrases
class TypeWriter {
    constructor(element, phrases, speed = 50) {
        this.element = element;
        this.phrases = phrases;
        this.currentPhraseIndex = 0;
        this.speed = speed;
        this.currentIndex = 0;
        this.isTyping = false;
        this.isDeleting = false;
    }

    start() {
        if (this.isTyping) return;
        this.isTyping = true;
        this.type();
    }

    type() {
        if (this.isDeleting) {
            this.delete();
            return;
        }

        if (this.currentIndex < this.phrases[this.currentPhraseIndex].length) {
            this.element.textContent += this.phrases[this.currentPhraseIndex].charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
            // Wait before starting to delete
            setTimeout(() => {
                this.isDeleting = true;
                this.delete();
            }, 2000);
        }
    }

    delete() {
        if (this.element.textContent.length > 0) {
            this.element.textContent = this.element.textContent.slice(0, -1);
            setTimeout(() => this.delete(), this.speed / 2);
        } else {
            this.isDeleting = false;
            this.currentIndex = 0;
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            setTimeout(() => this.type(), 500);
        }
    }

    reset() {
        this.element.textContent = '';
        this.currentIndex = 0;
        this.currentPhraseIndex = 0;
        this.isTyping = false;
        this.isDeleting = false;
    }
}

// Initialize typing animation with multiple phrases
const typingElement = document.getElementById('typing-text');
const phrases = [
    "coding and creating",
    "building the future",
    "designing solutions",
    "crafting experiences",
    "innovating daily"
];
const typeWriter = new TypeWriter(typingElement, phrases, 30);

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        typeWriter.start();
    }, 1000);
});
