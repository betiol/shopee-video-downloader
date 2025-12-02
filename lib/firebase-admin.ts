import * as admin from "firebase-admin";

if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, "\n"),
            }),
            databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
        });
    } else {
        console.warn("⚠️ Firebase Admin keys missing. Admin features will not work.");
        // Initialize with null/mock to prevent crash on export, but methods will fail
        // Actually, better to not initialize and let it fail when used, or mock it.
        // For now, we'll just not initialize, but we need to handle the exports.
        // If we don't initialize, admin.auth() throws "The default Firebase app does not exist."
        // So we should initialize a dummy app if keys are missing to prevent import-time crashes.
        admin.initializeApp({
            projectId: "demo-project",
        });
    }
}

export const adminAuth = admin.auth();
export const adminDb = admin.database();
