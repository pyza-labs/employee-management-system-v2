import { Observable, of, from } from "rxjs";
import { User } from "../User";
import { auth } from "firebase";
import { FirestoreCollectionReference } from "../../utils";

export const listenToAuthState = (): Observable<User | null> => {
  return new Observable<User | null>(observer => {
    auth().onAuthStateChanged(currentUser => {
      if (!currentUser) {
        observer.next(null);
        return;
      }
      FirestoreCollectionReference.Users()
        .doc(currentUser.uid)
        .onSnapshot(
          documentSnapshot => {
            const user = {
              id: documentSnapshot.id,
              ...documentSnapshot.data()
            } as User;
            observer.next(user);
          },
          error => observer.error(error)
        );
    });
  });
};

export const logout = () => from(auth().signOut());
