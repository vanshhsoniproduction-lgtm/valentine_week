const CONFIG = {
    password: "loveyouabiti",
    noTexts: [
        "No? 😢", 
        "Are you sure? 🥺", 
        "Think again! 🤔", 
        "Last chance! 💔", 
        "Just say Yes! 💖"
    ],
    galleryImages: [
        { src: 's2.jpeg', type: 'landscape', caption: 'My Favorite View ❤️' },
        { src: 'a1.jpeg', type: 'portrait', caption: 'Beautiful You' },
        { src: 'a3.jpeg', type: 'portrait', caption: 'Precious Moments' },
        { src: 'a4.jpeg', type: 'portrait', caption: 'Us Forever' },
        { src: 'a5.jpeg', type: 'portrait', caption: 'Sweet Memories' },
        { src: 'a6.jpeg', type: 'portrait', caption: 'Love & Laughter' },
        { src: 'a7.jpeg', type: 'portrait', caption: 'Together Always' }
    ]
};

// State
let noCount = 0;
let yesClickCount = 0; // For the 3-step confirmation

// DOM Elements
const scenes = {
    ask: document.getElementById('scene-ask'),
    confirm: document.getElementById('scene-confirm'),
    password: document.getElementById('scene-password'),
    gallery: document.getElementById('scene-gallery')
};

const audio = document.getElementById('bg-music');

// Scene Management
function showScene(sceneId) {
    // Hide all scenes
    Object.values(scenes).forEach(scene => {
        if(scene) scene.classList.remove('active');
    });
    // Show target scene
    const target = document.getElementById(sceneId);
    if(target) {
        target.classList.add('active');
        if(sceneId === 'scene-gallery') {
            initGallery();
        }
    }
}

// Initial Button Logic
const noBtn = document.getElementById('btn-no');
const yesBtn = document.getElementById('btn-yes');
const questionText = document.getElementById('question-text');

if(noBtn) {
    noBtn.addEventListener('click', () => {
        noCount++;
        
        // Change Text
        if (noCount < CONFIG.noTexts.length) {
            noBtn.textContent = CONFIG.noTexts[noCount];
        } else {
            noBtn.style.display = 'none'; // Disappear after 4 tries
        }

        // Shrink No Button
        const currentScale = 1 - (noCount * 0.2);
        noBtn.style.transform = `scale(${Math.max(0, currentScale)})`;

        // Grow Yes Button
        const currentYesScale = 1 + (noCount * 0.5);
        yesBtn.style.transform = `scale(${currentYesScale})`;
    });
}

if(yesBtn) {
    yesBtn.addEventListener('click', () => {
        // Reset scales for next scene if needed, or just proceed
        yesClickCount++;
        handleYesClick();
    });
}

function handleYesClick() {
    // We already clicked Yes once on the first screen
    // Now we need 3 more strictly defined interactions or just proceed?
    // User said: "yes pr click krne se do you relaly love me... toh 3 times yes karna hoga ! and then password mangega"
    // So 1st click (Scene 1) -> Leads to a sequence of 3 confirmations? Or works as the first of 3?
    // Let's assume Scene 1 is the 1st "Yes". Then we need 2 more confirmation dialogs?
    // Or Scene 1 leads to Scene 2 which HAS the 3 questions?
    // User said: "no karne pr... yes bada! 4 ke baad... yes pr click krne se do you relaly love me... toh 3 times yes karna hoga"
    // Interpretation: Scene 1 Yes -> Scene 2 (Q2) -> Scene 3 (Q3) -> Password
    
    // Changing scene to Confirmation Sequence
    showConfirmationSequence();
}

let confirmationStep = 0;
const confirmationTexts = [
    "Do you really love me? 🌹",
    "Like really really? 😲",
    "Promise forever? 💍"
];

function showConfirmationSequence() {
    // We reuse a generic confirmation scene or change text dynamically
    showScene('scene-confirm');
    updateConfirmationText();
}

const confirmBtn = document.getElementById('btn-confirm-yes');
const confirmText = document.getElementById('confirm-text');

if(confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        confirmationStep++;
        if(confirmationStep < confirmationTexts.length) {
            updateConfirmationText();
        } else {
            showScene('scene-password');
        }
    });
}

function updateConfirmationText() {
    if(confirmText && confirmationTexts[confirmationStep]) {
        confirmText.textContent = confirmationTexts[confirmationStep];
        // Reset animation to re-trigger it
        confirmText.style.animation = 'none';
        confirmText.offsetHeight; /* trigger reflow */
        confirmText.style.animation = 'float 3s ease-in-out infinite';
    }
}

// Password Logic
const passwordInput = document.getElementById('password-input');
const passwordBtn = document.getElementById('btn-password');
const errorMsg = document.getElementById('password-error');

function checkPassword() {
    if(passwordInput.value.toLowerCase() === CONFIG.password.toLowerCase()) {
        unlockGallery();
    } else {
        errorMsg.textContent = "Wrong password! Hint: It's about 'love' and 'abiti'";
        errorMsg.classList.add('visible');
        setTimeout(() => errorMsg.classList.remove('visible'), 2000);
    }
}

if(passwordBtn) {
    passwordBtn.addEventListener('click', checkPassword);
}
if(passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') checkPassword();
    });
}

function unlockGallery() {
    // Start Audio
    if(audio) {
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play failed (user interaction needed?):", e));
    }
    showScene('scene-gallery');
}

// Gallery Logic
function initGallery() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = ''; // Clear existing

    // Header updates
    // "happy valeentines day , do you want to be my valentine , is baar likha hua aftwer passwoerd !"
    const headerTitle = document.querySelector('.gallery-header h1');
    const headerSub = document.querySelector('.gallery-header p');
    if(headerTitle) headerTitle.textContent = "Happy Valentine's Day! 💖";
    if(headerSub) headerSub.textContent = "Do you want to be my Valentine? 🌹";

    CONFIG.galleryImages.forEach((img, index) => {
        const card = document.createElement('div');
        card.className = `photo-card ${img.type}`;
        
        // Random rotation for polaroid effect (-5 to 5 deg)
        const rotation = (Math.random() * 10) - 5;
        card.style.setProperty('--rotation', `${rotation}deg`);
        
        card.innerHTML = `
            <img src="${img.src}" alt="${img.caption}" loading="lazy">
            <div class="photo-caption">${img.caption}</div>
        `;
        
        grid.appendChild(card);

        // Staggered animation
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 300 + 500); // Start after header
    });

    createFloatingHearts();
}

function createFloatingHearts() {
    const container = document.querySelector('.bg-hearts');
    if(!container) return;

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 500);
}

// Start
document.addEventListener('DOMContentLoaded', () => {
    showScene('scene-ask');
});
