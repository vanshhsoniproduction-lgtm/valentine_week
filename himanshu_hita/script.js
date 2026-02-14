const CONFIG = {
    password: "himanshu loves hita",
    initialNoTexts: [
        "No? 😢",
        "Really? 🥺",
        "Think again! 💔",
        "Don't do this! 😭",
        "I'm gonna cry... 💧",
        "Just click Yes! 😡"
    ]
};

// Global State
let noClickCount = 0;

// DOM Elements
const scenes = {
    ask: document.getElementById('scene-ask'),
    confirm: document.getElementById('scene-confirm'),
    password: document.getElementById('scene-password'),
    letter: document.getElementById('scene-letter')
};

// Navigation
function showScene(sceneId) {
    Object.values(scenes).forEach(s => s.classList.remove('active'));
    const target = document.getElementById(sceneId);
    if (target) target.classList.add('active');
}

// Scene 1 Interaction: The "No" Button Chase
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');

function moveNoButton() {
    // Make the No button run away
    const x = Math.random() * (window.innerWidth - btnNo.offsetWidth - 20);
    const y = Math.random() * (window.innerHeight - btnNo.offsetHeight - 20);
    
    // Ensure it doesn't go off screen or overlap too much with Yes button logic, 
    // but simplified: absolute positioning logic override
    btnNo.style.position = 'fixed'; // detach from flow
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
    
    // Update Text
    if (noClickCount < CONFIG.initialNoTexts.length) {
        btnNo.textContent = CONFIG.initialNoTexts[noClickCount % CONFIG.initialNoTexts.length];
    }

    // Grow Yes Button
    const scale = 1 + (noClickCount * 0.3); // Grow by 30% each time
    btnYes.style.transform = `scale(${scale})`;
    
    noClickCount++;
}

if (btnNo) {
    // "Interactivity xyada daal dena" -> Mouseover and Click triggers move
    btnNo.addEventListener('mouseover', moveNoButton);
    btnNo.addEventListener('click', (e) => {
        e.preventDefault(); 
        moveNoButton();
    });
    // For mobile touch
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        moveNoButton();
    });
}

if (btnYes) {
    btnYes.addEventListener('click', () => {
        // Proceed to confirm sequence
        showScene('scene-confirm');
    });
}

// Scene 2: Confirmation
const btnConfirmYes = document.getElementById('btn-confirm-yes');
const confirmText = document.getElementById('confirm-text');
const confirmQuestions = [
    "Are you really sure? 🥺",
    "Like really really sure? 😲",
    "Promise forever? 💍",
    "Okay, enter the password! 💖"
];
let confirmStep = 0;

const btnConfirmNo = document.getElementById('btn-confirm-no');

if (btnConfirmYes) {
    btnConfirmYes.addEventListener('click', handleConfirmClick);
}

if (btnConfirmNo) {
    // "Interactivity xyada": When you try to click No in scene 2, it becomes Yes
    const turnToYes = () => {
        btnConfirmNo.textContent = "Yes! ❤️";
        btnConfirmNo.className = "btn-yes";
        btnConfirmNo.removeEventListener('mouseover', turnToYes);
        btnConfirmNo.addEventListener('click', handleConfirmClick);
    };
    btnConfirmNo.addEventListener('mouseover', turnToYes);
    btnConfirmNo.addEventListener('touchstart', (e) => { e.preventDefault(); turnToYes(); });
    btnConfirmNo.addEventListener('click', (e) => {
        if (btnConfirmNo.className.includes('btn-no')) {
            e.preventDefault();
            turnToYes();
        } else {
            handleConfirmClick();
        }
    });
}

function handleConfirmClick() {
    confirmStep++;
    if (confirmStep < confirmQuestions.length) {
        confirmText.textContent = confirmQuestions[confirmStep];
        confirmText.style.animation = 'none';
        confirmText.offsetHeight; 
        confirmText.style.animation = 'float 3s ease-in-out infinite';
        
        btnConfirmYes.style.transform = `scale(${1 + (confirmStep * 0.1)})`;
    } else {
        showScene('scene-password'); // Final step
        // When we go to password scene, we should show the prompt text clearly
        document.querySelector('#scene-password h1').textContent = "Enter The Magic Words... 🗝️";
    }
}

// Scene 3: Password
const inputPass = document.getElementById('password-input');
const btnUnlock = document.getElementById('btn-password');
const errorMsg = document.getElementById('password-error');

function checkPassword() {
    const val = inputPass.value.trim().toLowerCase();
    // User asked for "himanshu loves hita"
    if (val === CONFIG.password) {
        showScene('scene-letter');
    } else {
        errorMsg.textContent = "Wrong password! Hint: himanshu loves hita";
        errorMsg.classList.add('visible');
        setTimeout(() => errorMsg.classList.remove('visible'), 2000);
    }
}

if (btnUnlock) btnUnlock.addEventListener('click', checkPassword);
if (inputPass) {
    inputPass.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });
}

// Initialize
// (No special init needed besides valid HTML structure)
