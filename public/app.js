// --- app.js (Debe incluirse en todas las páginas protegidas) ---

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 1. Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD4FopYX645rwDYGSQTdDV0VObqds6q34g",
    authDomain: "proyecto-barack-4f731.firebaseapp.com",
    projectId: "proyecto-barack-4f731",
    storageBucket: "proyecto-barack-4f731.appspot.com",
    messagingSenderId: "730750717116",
    appId: "1:730750717116:web:1fbcab2cbb59e0d83454b9"
};
// Inicializa Firebase y Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const loginPage = 'login.html';

// Ejecuta la función cuando el DOM esté listo
function onDOMLoaded(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Muestra u oculta el contenido mientras se verifica la sesión
function showPageContent(show) {
    const loader = document.getElementById('loader') || document.getElementById('page-loader');
    const content = document.getElementById('page-content') || document.getElementById('main-content');
    if (show) {
        if (loader) loader.style.display = 'none';
        if (content) content.style.display = 'block';
    } else {
        if (loader) loader.style.display = 'flex';
        if (content) content.style.display = 'none';
    }
}

// Verifica autenticación y muestra la página cuando corresponda
onAuthStateChanged(auth, (user) => {
    onDOMLoaded(() => {
        if (user) {
            buildHeader(user);
            showPageContent(true);
        } else {
            window.location.replace(loginPage);
        }
    });
});

// Construye el encabezado dinámico
function buildHeader(user) {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    const navLinks = [
        { href: 'home.html', text: 'Inicio' },
        { href: 'listado-maestro.html', text: 'Listado Maestro' },
        { href: 'amfe.html', text: 'Análisis AMFE' },
        { href: 'sinoptico-producto.html', text: 'Sinóptico Producto' }
    ];

    const activePage = window.location.pathname.split('/').pop();
    const linksHtml = navLinks.map(link => {
        const isActive = link.href === activePage;
        const linkClasses = isActive
            ? 'bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium'
            : 'text-gray-300 hover:bg-gray-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium';
        return `<a href="${link.href}" class="${linkClasses}">${link.text}</a>`;
    }).join('');

    headerContainer.innerHTML = `
        <nav class="bg-gray-800 shadow-lg">
            <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div class="relative flex items-center justify-between h-16">
                    <div class="flex-1 flex items-center justify-start">
                        <div class="flex-shrink-0 flex items-center text-white font-bold">
                            <svg class="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Proyecto Barack
                        </div>
                        <div class="hidden sm:block sm:ml-6">
                            <div class="flex space-x-4">
                                ${linksHtml}
                            </div>
                        </div>
                    </div>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <span class="text-gray-400 text-sm mr-4">Usuario: ${user.email}</span>
                        <button id="logout-button" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;

    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth);
        });
    }
}
