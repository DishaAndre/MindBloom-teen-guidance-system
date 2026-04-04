import * as Realm from 'realm-web';

// Replace this with your actual Atlas App Services App ID
// You'll get this after creating the App in Atlas dashboard
const REALM_APP_ID = import.meta.env.VITE_REALM_APP_ID || 'YOUR_APP_ID_HERE';

const app = new Realm.App({ id: REALM_APP_ID });

export { app, Realm };
