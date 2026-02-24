import HttpCodes from '../helpers/http-codes';

class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpCodes.INTERNAL_SERVER_ERROR;
  }
}

export default InternalServerError;
