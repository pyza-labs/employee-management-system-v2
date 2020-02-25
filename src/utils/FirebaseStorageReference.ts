import { storage } from "firebase";

export const FirebaseStorageReference = {
  ProfilePictures: (fileName: string) =>
    storage()
      .ref()
      .child("profile-pictures")
      .child(fileName),
  UploadDocuments: (fileName: string, userId: string, questionId: string) =>
    storage()
      .ref()
      .child(`users/${userId}/answer/${questionId}`)
};
