export class BadRequest extends Error {
  code = 400;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequest';
  }
}
