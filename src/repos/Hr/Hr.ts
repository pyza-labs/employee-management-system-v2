import { FirestoreCollectionReference } from "../../utils";
import { Question, EmployeeQA, EmployeeProgress } from "../User";
import { Observable, from, zip, combineLatest } from "rxjs";
import { FormDataHRQuestions } from "../../containers/HR/HRHome/QuestionForm/QuestionForm";

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

// export const listenToEmployeeProgress = (orgCode: string) => {
//   return new Observable<>(observer =>
//     FirestoreCollectionReference.Users()
//       .where("orgCode", "==", orgCode)
//       .where("role", "==", "employee")
//       .onSnapshot(querySnapshot => {
//         const employeeProgress = querySnapshot.docs.map(mainDoc => {
//           const { name } = mainDoc.data();
//           return new Observable<EmployeeQA[]>(observer => {
//             FirestoreCollectionReference.Users()
//               .doc(mainDoc.id)
//               .collection("onboardingAnswers")
//               .get()
//               .then(querySnapshot => {
//                 const response: EmployeeQA[] = querySnapshot.docs.map(doc => {
//                   // mainDoc.data() is never undefined for query mainDoc snapshots
//                   return {
//                     question: doc.data().question,
//                     id: doc.id,
//                     answer: doc.data().answer
//                   };
//                 });
//                 observer.next(response);
//                 return {
//                   userId: mainDoc.id,
//                   name: name,
//                   response: response
//                 } as EmployeeProgress;
//               });
//           });
//         });
//       })
//   );
// };

//HR to HR
// Signin link with Signup and forgot password
// Not signed remove menu
//upload and setFire in one
//combine latest
