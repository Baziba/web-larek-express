import { HTTP_STATUS } from '../constants';

class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
}

export default InternalServerError;
