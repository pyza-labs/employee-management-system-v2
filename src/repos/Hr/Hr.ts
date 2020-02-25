import {
  FirestoreCollectionReference,
  firestoreQueryListener
} from "../../utils";
import { Question, EmployeeQA, EmployeeProgress, User } from "../User";
import { Observable, from, zip, combineLatest } from "rxjs";
import { FormDataHRQuestions } from "../../containers/HR/HRHome/QuestionForm/QuestionForm";
import { switchMap, map } from "rxjs/operators";

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

export const listenToEmployeeProgress = (
  orgCode: string
): Observable<EmployeeProgress[]> => {
  return firestoreQueryListener<User>(
    FirestoreCollectionReference.Users()
      .where("orgCode", "==", orgCode)
      .where("role", "==", "employee")
  ).pipe(
    switchMap(users => {
      const userQuestions = users.map(user =>
        firestoreQueryListener<EmployeeQA>(
          FirestoreCollectionReference.Users()
            .doc(user.id)
            .collection("onboardingAnswers")
        ).pipe(
          map(employeeQAs => ({
            userId: user.id,
            name: user.name,
            response: employeeQAs
          }))
        )
      );
      return combineLatest(userQuestions);
    })
  );
};

// Signin link with Signup and forgot password
// Not signed remove menu
//upload and setFire in one
//combine latest
