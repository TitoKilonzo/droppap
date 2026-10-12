export const ERROR_CODES = {
  VALIDATION_FAILED: { status: 422, message: "The request contains invalid data." },
  BAD_REQUEST: { status: 400, message: "The request could not be understood." },
  UNAUTHENTICATED: { status: 401, message: "Sign in to continue." },
  FORBIDDEN: { status: 403, message: "You do not have permission to do this." },
  NOT_FOUND: { status: 404, message: "The requested resource was not found." },
  CONFLICT: { status: 409, message: "The request conflicts with the current state." },
  PAYLOAD_TOO_LARGE: { status: 413, message: "The file or request is too large." },
  QUOTA_EXCEEDED: { status: 409, message: "The storage quota for this organization has been reached." },
  UPLOAD_SESSION_EXPIRED: { status: 409, message: "The upload session has expired. Start the upload again." },
  RATE_LIMITED: { status: 429, message: "Too many requests. Try again shortly." },
  CONFIGURATION_ERROR: { status: 500, message: "The service is not configured correctly." },
  INTERNAL_ERROR: { status: 500, message: "Something went wrong on our side." },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(code: ErrorCode, options?: { message?: string; details?: Record<string, unknown>; cause?: unknown }) {
    super(options?.message ?? ERROR_CODES[code].message, options?.cause === undefined ? undefined : { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.status = ERROR_CODES[code].status;
    this.details = options?.details;
  }
}

export interface ErrorBody {
  error: { code: ErrorCode; message: string; requestId: string; details?: Record<string, unknown> };
}

/**
 * Maps any thrown value to a safe HTTP error body. Unknown errors never leak
 * their message or stack to clients.
 */
export function toErrorResponse(error: unknown, requestId: string): { status: number; body: ErrorBody } {
  if (error instanceof AppError) {
    return {
      status: error.status,
      body: { error: { code: error.code, message: error.message, requestId, ...(error.details ? { details: error.details } : {}) } },
    };
  }
  return {
    status: ERROR_CODES.INTERNAL_ERROR.status,
    body: { error: { code: "INTERNAL_ERROR", message: ERROR_CODES.INTERNAL_ERROR.message, requestId } },
  };
}
