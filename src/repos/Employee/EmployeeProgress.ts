import { Answer } from "../Questions";

export interface EmployeeProgress {
  userId: string;
  name: string;
  response: Answer[];
}
