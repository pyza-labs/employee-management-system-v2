import { storage } from "firebase";

export const FirebaseStorageReference = {
  ProfilePictures: (fileName: string) =>
    storage()
      .ref()
      .child("profile-pictures")
      .child(fileName)
};
