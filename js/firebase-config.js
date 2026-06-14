/*
 * Firebase configuration.
 *
 * Sign-in and the discussion forum are OFF until you paste your project's
 * config below. The rest of the site (problems, progress, starred list,
 * language toggle) works fully without it.
 *
 * HOW TO TURN IT ON  (see SETUP-BACKEND.md for the full walkthrough):
 *   1. Create a free Firebase project at https://console.firebase.google.com
 *   2. Add a Web app; copy its config object.
 *   3. Enable Authentication → Sign-in method → Google.
 *   4. Create a Firestore database (production mode) and paste the rules
 *      from firestore.rules.
 *   5. Replace the null below with your config object, e.g.:
 *
 *      window.FIREBASE_CONFIG = {
 *        apiKey: "…",
 *        authDomain: "your-app.firebaseapp.com",
 *        projectId: "your-app",
 *        appId: "…"
 *      };
 *
 * Note: Firebase web config values are NOT secrets — they're meant to ship
 * in client code. Access is controlled by the Firestore security rules.
 */
window.FIREBASE_CONFIG = null;
