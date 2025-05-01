import { Request, Response, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request") {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  console.error(`Error: ${err}`);

  // Handle TSOA validation errors
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Validation Failed",
      details: err.fields,
    });
  }

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Conflict: Resource already exists",
        details: err.meta?.target || "Unique constraint violation",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Resource not found",
      });
    }
  }

  // Handle custom HTTP errors
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Handle generic errors
  return res.status(500).json({
    message: err instanceof Error ? err.message : "Internal Server Error",
  });
}