export class ValidateHelper {
  static email(value: string) {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(value);
  }
}
