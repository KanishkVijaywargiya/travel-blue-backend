class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

// constructor is a special method which use to create & initialize and object of the class
// one way to use:
// throw new ApiError(404, "Not Found", ["Resource not found"]);
// another way to use:
// throw new ApiError(
//  { statusCode: 404, message: "Not Found", errors: ["Resource not found"] }
// );
