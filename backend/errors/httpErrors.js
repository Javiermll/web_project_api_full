class BadRequestError extends Error {
  constructor(message = 'Bad Request') {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
  }
}

class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.statusCode = 403;
    this.name = 'ForbiddenError';
  }
}

class InternalServerError extends Error {
  constructor(message = 'Internal Server Error') {
    super(message);
    this.statusCode = 500;
    this.name = 'InternalServerError';
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
};