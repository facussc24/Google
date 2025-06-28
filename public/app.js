// --- app.js (Este archivo debe ser vinculado en TODAS tus páginas HTML) ---

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// --- 1. CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyD4FopYX645rwDYGSQTdDV0VObqds6q34g",
    authDomain: "proyecto-barack-4f731.firebaseapp.com",
    projectId: "proyecto-barack-4f731",
    storageBucket: "proyecto-barack-4f731.firebasestorage.app",
    messagingSenderId: "730750717116",
    appId: "1:730750717116:web:1fbcab2cbb59e0d83454b9"
};

// --- 2. INICIALIZACIÓN Y LÓGICA DE AUTENTICACIÓN ---
try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const protectedPages = ['home.html', 'amfe.html', 'listado-maestro.html'];
    const currentPage = window.location.pathname.split('/').pop();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Usuario autenticado:", user.email);
            buildHeader(user);
            if (currentPage === 'index.html' || currentPage === 'iniciar-sesion.html' || currentPage === '') {
                window.location.href = 'home.html';
            }
        } else {
            console.log("No hay usuario autenticado.");
            if (protectedPages.includes(currentPage)) {
                console.log(`Acceso denegado a ${currentPage}. Redirigiendo...`);
                window.location.href = 'index.html';
            }
        }
    });

    // --- 3. CONSTRUCTOR DEL ENCABEZADO Y NAVEGACIÓN ---
    function buildHeader(user) {
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) {
            console.error("No se encontró el 'header-container'. Asegúrate de que exista en tu HTML.");
            return;
        }

        const navLinks = [
            { href: 'home.html', text: 'Inicio' },
            { href: 'listado-maestro.html', text: 'Listado Maestro' },
            { href: 'amfe.html', text: 'Análisis AMFE' },
            { href: '#', text: 'Sinóptico Producto' }
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

        document.getElementById('logout-button').addEventListener('click', () => {
            signOut(auth).then(() => {
                console.log("Cierre de sesión exitoso.");
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error("Error al cerrar sesión:", error);
            });
        });
    }

} catch (error) {
    console.error("Error al inicializar Firebase:", error);
    document.body.innerHTML = '<div style="text-align: center; margin-top: 50px;"><h1>Error de Configuración</h1><p>No se pudo conectar con los servicios. Por favor, contacta al administrador.</p></div>';
}

