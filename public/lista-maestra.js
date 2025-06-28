// Lista Maestra - Firebase Realtime Database integration
// This module initializes Firebase and exposes helper functions
// to push items and subscribe to real-time updates.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-check.js';
import { getDatabase, ref, push, onChildAdded, onChildChanged, onChildRemoved } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Firebase configuration for proyecto-barack-4f731
const firebaseConfig = {
    apiKey: "AIzaSyD4FopYX645rwDYGSQTdDV0VObqds6q34g",
    authDomain: "proyecto-barack-4f731.firebaseapp.com",
    databaseURL: "https://proyecto-barack-4f731-default-rtdb.firebaseio.com",
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

// Initialize Firebase app and Database service
const app = initializeApp(firebaseConfig);
setupAppCheck(app);
const db = getDatabase(app);

// Reference to the master list in the database
const masterListRef = ref(db, 'miListaMaestra');

/**
 * Adds a new item to the master list using push().
 * @param {string} texto - Text to store in the item
 */
export function addItem(texto) {
    const newItem = { texto, timestamp: Date.now() };
    push(masterListRef, newItem);
}

/**
 * Subscribes to changes under /miListaMaestra and invokes callbacks
 * for child_added, child_changed and child_removed events.
 * @param {{onAdd?: Function, onChange?: Function, onRemove?: Function}} callbacks
 */
export function subscribeToList(callbacks = {}) {
    onChildAdded(masterListRef, snap => {
        const item = { id: snap.key, ...snap.val() };
        callbacks.onAdd && callbacks.onAdd(item);
    });

    onChildChanged(masterListRef, snap => {
        const item = { id: snap.key, ...snap.val() };
        callbacks.onChange && callbacks.onChange(item);
    });

    onChildRemoved(masterListRef, snap => {
        callbacks.onRemove && callbacks.onRemove(snap.key);
    });
}
