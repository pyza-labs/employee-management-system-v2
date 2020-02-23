import { firestore } from "firebase";

enum FirestoreCollection {
  Users = "users",
  OnBoardQuestions = "onboardingQuestions"
}

export const FirestoreCollectionReference = {
  Users: () => firestore().collection(FirestoreCollection.Users),
  OnBoardQuestions: () =>
    firestore().collection(FirestoreCollection.OnBoardQuestions)
};
