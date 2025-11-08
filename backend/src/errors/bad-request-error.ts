import { HTTP_STATUS } from '../constants';

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS.BAD_REQUEST;
  }
}

export default BadRequestError;
