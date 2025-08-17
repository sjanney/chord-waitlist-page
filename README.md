# Chord Waitlist Page

A modern waitlist page for Chord, featuring a typing animation, real-time military time display, and email collection.

## Features

- **Background Image**: Place your background image in the `assets/` folder as `background.jpg`
- **Typing Animation**: Left text area with animated typing effect
- **Real-time Clock**: Military time display on the right side
- **Email Input**: Center email input that logs to console when submitted
- **Responsive Design**: Works on both desktop and mobile devices

## Setup

1. Place your background image in the `assets/` folder and name it `background.jpg`
2. Open `index.html` in a web browser
3. The page will automatically start with the typing animation and real-time clock

## Customization

### Changing the Typing Text
Edit the `sampleText` variable in `script.js` to change the text that appears in the typing animation.

### Styling
Modify `styles.css` to adjust colors, fonts, and layout to match your design preferences.

### Email Functionality
The email input currently logs to the console. You can extend the functionality in `script.js` to send emails to a server or integrate with your backend.

## File Structure

```
chord-waitlist-page/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── assets/             # Place your background image here
│   └── background.jpg  # Your background image
└── README.md           # This file
```

## Browser Compatibility

This page works in all modern browsers that support:
- CSS Flexbox
- ES6 JavaScript
- CSS transforms and animations
