import {
  FirestoreCollectionReference,
  firestoreQueryListener
} from "../../utils";
import { Observable, combineLatest } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { User } from "../User";
import { EmployeeProgress } from "../Employee";
import { Answer } from "../Questions";

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
        firestoreQueryListener<Answer>(
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
