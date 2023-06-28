export class NotFound extends Error {
  code = 404;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequest';
  }
}
