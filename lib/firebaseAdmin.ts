import admin from "firebase-admin";

function getPrivateKey() {
  const k = process.env.FIREBASE_PRIVATE_KEY;
  if (!k) return undefined;
  return k.replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    }),
  });
}

export const firestoreAdmin = admin.firestore();