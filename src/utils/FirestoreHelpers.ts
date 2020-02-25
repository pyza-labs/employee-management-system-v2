import { firestore, Unsubscribe } from "firebase";
import { Observable } from "rxjs";

interface Identifiable {
  id: string;
}

export type DocumentSynthesizer<T> = (
  doc: firestore.DocumentSnapshot
) => T & Identifiable;

const defaultDocumentSynthesizer = <T>(doc: firestore.DocumentSnapshot) => {
  return { id: doc.id, ...doc.data() } as T & Identifiable;
};

export const firestoreQueryListener = <T>(
  ref: firestore.CollectionReference | firestore.Query,
  synthesizer: DocumentSynthesizer<T> = defaultDocumentSynthesizer
): Observable<(T & Identifiable)[]> => {
  let unsubscribe: Unsubscribe | null = null;
  const listener = new Observable<(T & Identifiable)[]>(observer => {
    unsubscribe = ref.onSnapshot(
      querySnapshot => {
        const data = querySnapshot.docs.map(synthesizer);
        observer.next(data);
      },
      error => {
        observer.error(error);
      }
    );
  });
  listener.subscribe(undefined, undefined, () => {
    unsubscribe && unsubscribe();
  });
  return listener;
};

export const firestoreDocumentListener = <T>(
  ref: firestore.DocumentReference,
  synthesizer: DocumentSynthesizer<T> = defaultDocumentSynthesizer
): Observable<T & Identifiable> => {
  let unsubscribe: Unsubscribe | null = null;
  const listener = new Observable<T & Identifiable>(observer => {
    unsubscribe = ref.onSnapshot(
      documentSnapshot => {
        const data = synthesizer(documentSnapshot);
        observer.next(data);
      },
      error => {
        observer.error(error);
      }
    );
  });
  listener.subscribe(undefined, undefined, () => {
    unsubscribe && unsubscribe();
  });
  return listener;
};
