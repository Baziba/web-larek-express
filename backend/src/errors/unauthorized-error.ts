import HttpCodes from '../helpers/http-codes';

class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
