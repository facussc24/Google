import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const app = initializeApp({});
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Redirect already authenticated users
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'home.html';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    getRedirectResult(auth)
        .then((result) => {
            if (result && result.user) {
                window.location.href = 'home.html';
            }
        })
        .catch((error) => {
            console.error('Google redirect error:', error.code, error.message);
        });
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
                .then(() => {
                    window.location.href = 'home.html';
                })
                .catch(() => {
                    signInWithRedirect(auth, googleProvider).catch((error) => {
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
        });
    }
});
