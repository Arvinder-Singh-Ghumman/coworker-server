import { initializeApp } from "firebase/app";
import { Timestamp } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5c6c16gWt3HwQqkjrvY7cT-AbvIISAqc",
  authDomain: "coworkerproject-cce6f.firebaseapp.com",
  projectId: "coworkerproject-cce6f",
  storageBucket: "coworkerproject-cce6f.appspot.com",
  messagingSenderId: "939678640035",
  appId: "1:939678640035:web:b4a86408fa808871c8dc16",
  measurementId: "G-Q1QBXBQ6C7",
};
const adminApp = initializeApp(firebaseConfig);

// Access the Firebase Storage bucket
const storage = getStorage(adminApp);

async function uploadFileToStorage(req, res, next) {
  try {
    console.log("here")
    console.log(req.body)
    if (Array.isArray(req.files)) {
      const urls = [];

      for (const file of req.files) {
        const storageRef = ref(
          storage,
          `files/${file.originalname + "_" + Timestamp.now()}`
        );

        const metadata = {
          contentType: file.mimetype,
        };

        const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
        const url = await getDownloadURL(snapshot.ref);
        urls.push(url);
      }

      console.log("Files successfully uploaded.");
      req.body.picturePaths = urls;
    } else if (req.file) {
      const storageRef = ref(
        storage,
        `files/${req.file.originalname + "_" + Timestamp.now()}`
      );

      const metadata = {
        contentType: req.file.mimetype,
      };

      const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
      const url = await getDownloadURL(snapshot.ref);

      console.log("File successfully uploaded.");
      req.body.picturePath = url;
    }
    next();
  } catch (error) {
    return res.status(400).send(error.message);
  }
}
export default uploadFileToStorage;
