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

// Google Sheets API Configuration - Loaded from environment variables
let GOOGLE_API_KEY = null;
let SPREADSHEET_ID = null;
let googleApiInitialized = false;

// Load configuration from environment variables
async function loadConfig() {
    try {
        console.log('🔧 Loading configuration from environment variables...');
        const response = await fetch('/api/config');
        const config = await response.json();
        
        if (config.error) {
            throw new Error(config.error);
        }
        
        GOOGLE_API_KEY = config.googleApiKey;
        SPREADSHEET_ID = config.spreadsheetId;
        
        console.log('✅ Configuration loaded:', {
            hasApiKey: config.hasApiKey,
            hasSpreadsheetId: config.hasSpreadsheetId
        });
        
        return config;
    } catch (error) {
        console.error('❌ Failed to load configuration:', error);
        throw error;
    }
}

// Initialize Google API
function initGoogleAPI() {
    return new Promise(async (resolve, reject) => {
        try {
            // Load configuration first
            await loadConfig();
            
            // Check if API key is configured
            if (!GOOGLE_API_KEY) {
                const error = 'Google API key not configured. Please set GOOGLE_API_KEY environment variable.';
                console.error('❌', error);
                reject(new Error(error));
                return;
            }
            
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        apiKey: GOOGLE_API_KEY,
                        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                    });
                    
                    // Load the sheets API specifically
                    await gapi.client.load('sheets', 'v4');
                    
                    googleApiInitialized = true;
                    console.log('✅ Google API initialized successfully');
                    console.log('✅ Google Sheets API loaded');
                    resolve();
                } catch (error) {
                    console.error('❌ Failed to initialize Google API:', error);
                    reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Add entry to Google Sheets
async function addToGoogleSheets(name, email) {
    try {
        // Check if spreadsheet ID is configured
        if (!SPREADSHEET_ID) {
            throw new Error('Spreadsheet ID not configured. Please set SPREADSHEET_ID environment variable.');
        }
        
        // Check if API is initialized
        if (!googleApiInitialized) {
            console.log('🔄 Google API not initialized, initializing now...');
            await initGoogleAPI();
        }
        
        // Double-check that sheets API is available
        if (!gapi.client.sheets) {
            throw new Error('Google Sheets API not available. Please check your API key and try again.');
        }
        
        console.log('🌐 Making direct Google Sheets API call...');
        
        const entryTimestamp = new Date().toISOString();
        const values = [[entryTimestamp, name, email]];
        
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:C',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: values
            }
        });
        
        console.log('✅ Entry added to Google Sheets successfully:', response.result);
        return { success: true, data: response.result };
        
    } catch (error) {
        console.error('❌ Google Sheets API Error:', error);
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
        console.log('✅ Form validation passed, sending to Google Sheets...');
        
        try {
            // Add to Google Sheets directly
            const result = await addToGoogleSheets(name, email);
            
            if (result.success) {
                console.log('✅ Entry added to Google Sheets successfully:', { name, email });
            } else {
                console.error('❌ Failed to add entry to Google Sheets');
            }
        } catch (error) {
            console.error('💥 Google Sheets API Error:', error);
            console.error('💥 Error message:', error.message);
            console.error('💥 Error details:', error.result?.error);
            
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
    
    // Initialize Google API when page loads
    console.log('🚀 Initializing Google API...');
    initGoogleAPI().then(() => {
        console.log('✅ Google API ready for use');
    }).catch((error) => {
        console.error('❌ Failed to initialize Google API:', error);
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
