import { firestore } from "firebase";

enum FirestoreCollection {
  Users = "users"
}

export const FirestoreCollectionReference = {
  Users: () => firestore().collection(FirestoreCollection.Users)
};
