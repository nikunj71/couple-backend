import  admin from 'firebase-admin';
import serviceAccount from './couple-rating-cd2e5-firebase-adminsdk-qci2c-2e1ac6558b.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


export default  admin;
