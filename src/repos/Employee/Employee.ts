import { FirebaseStorageReference } from "../../utils";
import { Observable } from "rxjs";
import { storage } from "firebase";

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
