import { Observable, of, from } from "rxjs";
import { User } from "../User";
import { auth, storage } from "firebase";
import {
  FirestoreCollectionReference,
  FirebaseStorageReference
} from "../../utils";
import { switchMap, map } from "rxjs/operators";
import { FormData } from "../../containers/SignUp/SignUp";

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

export const signIn = (
  email: string,
  password: string,
  orgCode: string
): Observable<void> => {
  return from(auth().signInWithEmailAndPassword(email, password)).pipe(
    switchMap(user => {
      return FirestoreCollectionReference.Users()
        .doc(user.user!.uid)
        .get();
    }),
    map(documentSnapshot => {
      if (!documentSnapshot.exists) {
        auth().signOut();
        throw new Error("User does not exist");
      }
      const user = documentSnapshot.data() as User;
      if (user.orgCode !== orgCode) {
        auth().signOut();
        throw new Error("Your organisation code is incorrect");
      }
      return;
    })
  );
};

export const resetPassword = (email: string) => {
  return from(auth().sendPasswordResetEmail(email));
};

export const signUp = (
  id: string,
  values: FormData,
  state: string,
  region: string
): Observable<void> => {
  return from(
    FirestoreCollectionReference.Users()
      .doc(id)
      .set({
        name: values.name,
        email: values.email,
        orgCode: values.orgCode,
        role: values.role,
        bio: values.bio,
        pan: values.pan,
        address: values.address,
        state: state,
        region: region
      })
  );
};

export const uploadProfilePicture = (file: File) => {
  return new Observable<storage.UploadTaskSnapshot>(observer => {
    const metadata = {
      contentType: "image/jpeg"
    };
    FirebaseStorageReference.ProfilePictures(file.name)
      .put(file, metadata)
      .on(
        storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          observer.next(snapshot);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
  });
};

export const createUser = (email: string, password: string) => {
  return from(auth().createUserWithEmailAndPassword(email, password));
};
