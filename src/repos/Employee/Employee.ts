import {
  FirestoreCollectionReference,
  FirebaseStorageReference
} from "../../utils";
import { Observable, from, zip } from "rxjs";
import { Question } from "../User";
import { storage } from "firebase";
import { EmployeeQA } from "../User/EmployeeQA";

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
): Observable<EmployeeQA> => {
  return new Observable<EmployeeQA>(observer => {
    FirestoreCollectionReference.Users()
      .doc(userId)
      .collection("onboardingAnswers")
      .doc(questionId)
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot.data()) {
            const documentData: EmployeeQA = {
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

export const uploadDocuments = (
  file: File,
  userId: string,
  questionId: string
) => {
  return new Observable<storage.UploadTaskSnapshot>(observer => {
    const metadata = {
      contentType: "image/jpeg" || "application/pdf"
    };
    FirebaseStorageReference.UploadDocuments(file.name, userId, questionId)
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
