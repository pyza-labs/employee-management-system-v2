import { FirestoreCollectionReference } from "../../utils";
import { Observable } from "rxjs";
import { Question } from "../User";

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

export const listenToEmployeeAnswers = (userId: string, questionId: string) =>
  FirestoreCollectionReference.Users()
    .doc(userId)
    .collection("onboardingAnswers")
    .doc(questionId)
    .onSnapshot(documentSnapshot => {
      if (documentSnapshot.data()) {
        const documentData: empDocData = {
          question: documentSnapshot.data()!.question,
          id: documentSnapshot.id,
          answer: documentSnapshot.data()!.answer
        };
        const { answer } = documentData;
      }
    });
