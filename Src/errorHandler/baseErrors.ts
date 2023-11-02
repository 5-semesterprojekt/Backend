export class BaseError extends Error {
  public status: number;
  public errors?: any;
  constructor(
    message: string = 'Base error',
    status: number = 500,
    errors?: any,
  ) {
    super();
    super.message = message;
    super.name = codeToMessage(status);
    this.status = status;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

function codeToMessage(errorNumber: number): string {
  const errorMessages: { [key: number]: string } = {
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    306: '(Unused)',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
  };
  return errorMessages[errorNumber];
}
