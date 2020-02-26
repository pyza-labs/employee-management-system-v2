export interface Question {
  id: string;
  important: boolean;
  orgCode: string;
  type: string;
  question: string;
  options?: string[];
}
