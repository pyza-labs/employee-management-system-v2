import { FirestoreCollectionReference } from "../../utils";
import { Question } from "../User";
import { Observable, from } from "rxjs";

export const listenToHrQuestionsState = (
  orgCode: string
): Observable<Question[] | null> => {
  return new Observable<Question[] | null>(observer => {
    FirestoreCollectionReference.OnBoardQuestions()
      .where("orgCode", "==", orgCode)
      .onSnapshot(
        querySnapshot => {
          const questions = querySnapshot.docs.map(
            doc =>
              ({
                id: doc.id,
                ...doc.data() // Force Casting
              } as Question)
          );
          observer.next(questions);
        },
        error => observer.error(error)
      );
  });
};

export const updateImportantHandler = (
  checked: boolean,
  docId: string
): Observable<void> => {
  return from(
    FirestoreCollectionReference.OnBoardQuestions()
      .doc(docId)
      .update({
        important: checked
      })
  );
};

export const deleteQuestionHandler = (docId: string): Observable<void> => {
  return from(
    FirestoreCollectionReference.OnBoardQuestions()
      .doc(docId)
      .delete()
  );
};

// deleteQuestionHandler: Observable<void> difference
