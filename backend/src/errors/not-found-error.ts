import { HTTP_STATUS } from '../constants';

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS.NOT_FOUND;
  }
}

export default NotFoundError;
