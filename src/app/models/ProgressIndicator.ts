
export class ProgressIndicator {
  type: string;
  message: string;

  constructor(type: string, message: string) {
    this.type = type;
    this.message = message;
  }

  updateProgress(type: string, message: string) {
    this.type = type;
    this.message = message;
  }
}
