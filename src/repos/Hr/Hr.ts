import { FirestoreCollectionReference } from "../../utils";
import { Question } from "../User";
import { Observable, from } from "rxjs";
import { FormDataHrQuestions } from "../../containers/HR/HrHome/QuestionForm/QuestionForm";

export const listenToHrQuestions = (
  orgCode: string
): Observable<Question[]> => {
  return new Observable<Question[]>(observer => {
    FirestoreCollectionReference.OnBoardQuestions()
      .where("orgCode", "==", orgCode)
      .onSnapshot(
        querySnapshot => {
          const questions = querySnapshot.docs.map(
            doc =>
              ({
                id: doc.id,
                ...doc.data()
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

export const setOnBoardingQuestions = (
  values: FormDataHrQuestions,
  orgCode: string,
  options?: string[]
): Observable<void> => {
  if (options && options?.length !== 0) {
    return from(
      FirestoreCollectionReference.OnBoardQuestions()
        .doc()
        .set({
          question: values.question,
          orgCode: orgCode,
          important: values.important,
          type: values.type,
          options: options
        })
    );
  } else {
    return from(
      FirestoreCollectionReference.OnBoardQuestions()
        .doc()
        .set({
          question: values.question,
          orgCode: orgCode,
          important: values.important,
          type: values.type
        })
    );
  }
};

//Handler remove
//Hr to HR
// Add index file to required places
// Signin link with Signup and forgot password
// Not signed remove menu
