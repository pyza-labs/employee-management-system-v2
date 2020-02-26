import { FirestoreCollectionReference } from "../../utils";
import { Answer, Question } from "./index";
import { Observable, from } from "rxjs";
import { FormDataHRQuestions } from "../../containers";

export const listenToHRQuestions = (
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

export const updateImportant = (
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

export const deleteQuestion = (docId: string): Observable<void> => {
  return from(
    FirestoreCollectionReference.OnBoardQuestions()
      .doc(docId)
      .delete()
  );
};

export const setOnBoardingQuestions = (
  values: FormDataHRQuestions,
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

export const listenToEmployeeQuestions = (
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

export const listenToEmployeeAnswers = (
  userId: string,
  questionId: string
): Observable<Answer> => {
  return new Observable<Answer>(observer => {
    FirestoreCollectionReference.Users()
      .doc(userId)
      .collection("onboardingAnswers")
      .doc(questionId)
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot.data()) {
            const documentData: Answer = {
              question: documentSnapshot.data()!.question,
              id: documentSnapshot.id,
              answer: documentSnapshot.data()!.answer
            };
            observer.next(documentData);
          }
        },
        error => observer.error(error)
      );
  });
};

export const updateEmployeeAnswer = (
  text: string,
  userId: string,
  questionId: string,
  question: string
) => {
  return from(
    FirestoreCollectionReference.Users()
      .doc(userId)
      .collection("onboardingAnswers")
      .doc(questionId)
      .set(
        {
          question: question,
          answer: text
        },
        { merge: true }
      )
  );
};
