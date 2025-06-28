import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-check.js";
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
const recaptchaV3SiteKey = "6LdzJ3ErAAAAAAHV3HV1x8vIOjm3lcehnfWfjYT6r";

function setupAppCheck(firebaseApp) {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(recaptchaV3SiteKey),
        isTokenAutoRefreshEnabled: true
    });
    console.log('✅ Firebase App Check inicializado con reCAPTCHA v3');
}

const app = initializeApp(firebaseConfig);
setupAppCheck(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Redirect already authenticated users
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'home.html';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loginButton = loginForm.querySelector('button[type="submit"]');
    const googleBtn = document.getElementById('google-login-button');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');
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
                errorMessage.textContent = friendlyMessage;
                errorMessage.className = 'message-placeholder text-center text-sm text-red-600';
                errorMessage.classList.remove('hidden');
                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.textContent = 'Ingresar';
                }
            });
    });

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            errorMessage.textContent = '';
            errorMessage.classList.add('hidden');
            signInWithPopup(auth, googleProvider)
                .catch(() => signInWithRedirect(auth, googleProvider))
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
                    errorMessage.textContent = friendlyMessage;
                    errorMessage.className = 'message-placeholder text-center text-sm text-red-600';
                    errorMessage.classList.remove('hidden');
                });
        });
    }
});
