class Error {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statuscode: number) {
    this.message = message;
    this.statusCode = statuscode;
  }
}

export default Error;
