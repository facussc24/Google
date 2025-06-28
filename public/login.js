import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD4FopYX645rwDYGSQTdDV0VObqds6q34g",
    authDomain: "proyecto-barack-4f731.firebaseapp.com",
    projectId: "proyecto-barack-4f731",
    storageBucket: "proyecto-barack-4f731.appspot.com",
    messagingSenderId: "730750717116",
    appId: "1:730750717116:web:1fbcab2cbb59e0d83454b9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Redirect already authenticated users
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'home.html';
    }
});

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageContainer = document.getElementById('message-container');
const loginButton = loginForm.querySelector('button[type="submit"]');
const googleBtn = document.getElementById('google-signin-btn');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    messageContainer.textContent = '';
    if (loginButton) {
        loginButton.disabled = true;
        loginButton.textContent = 'Ingresando...';
    }
    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .then(() => {
            window.location.href = 'home.html';
        })
        .catch((error) => {
            console.error('Login error:', error.code, error.message);
            let friendlyMessage = 'No fue posible iniciar sesión.';
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    friendlyMessage = 'El correo o la contraseña son incorrectos.';
                    break;
                case 'auth/invalid-email':
                    friendlyMessage = 'El formato del correo electrónico no es válido.';
                    break;
            }
            messageContainer.textContent = friendlyMessage;
            messageContainer.className = 'message-placeholder text-center text-sm text-red-600';
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.textContent = 'Ingresar';
            }
        });
});

if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        messageContainer.textContent = '';
        signInWithPopup(auth, googleProvider)
            .then(() => {
                window.location.href = 'home.html';
            })
            .catch((error) => {
                console.error('Google sign-in error:', error.code, error.message);
                let friendlyMessage = 'Error al iniciar sesión con Google.';
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        friendlyMessage = 'La ventana de inicio de sesión fue cerrada.';
                        break;
                    case 'auth/account-exists-with-different-credential':
                        friendlyMessage = 'Ya existe una cuenta con este email.';
                        break;
                }
                messageContainer.textContent = friendlyMessage;
                messageContainer.className = 'message-placeholder text-center text-sm text-red-600';
            });
    });
}
