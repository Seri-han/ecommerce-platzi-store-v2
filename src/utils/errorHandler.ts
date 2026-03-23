type UnknownError = unknown;

export type AppError = {
  title: string;
  message: string;
  code?: string | number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getErrorMessage(error: UnknownError): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (isObject(error) && typeof error.message === "string") {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function normalizeError(error: UnknownError): AppError {
  const message = getErrorMessage(error);

  if (
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("ERR_CONNECTION_RESET")
  ) {
    return {
      title: "Connection error",
      message: "We couldn't connect to the service. Please try again.",
      code: "NETWORK_ERROR",
    };
  }

  if (message.includes("404")) {
    return {
      title: "Not found",
      message: "The requested resource could not be found.",
      code: 404,
    };
  }

  if (message.includes("403")) {
    return {
      title: "Access denied",
      message: "You do not have permission to access this resource.",
      code: 403,
    };
  }

  if (message.includes("500")) {
    return {
      title: "Server error",
      message: "The server returned an error. Please try again later.",
      code: 500,
    };
  }

  return {
    title: "Something went wrong",
    message,
  };
}

export function getSafeImageUrl(
  value?: string | null,
  fallback = "/images/placeholder-product.png",
): string {
  if (!value) return fallback;

  const trimmed = value.trim();

  if (!trimmed) return fallback;

  if (
    trimmed.includes("i.imgur.com") ||
    trimmed.includes("api.escuelajs.co/api/v1/files/")
  ) {
    return fallback;
  }

  return trimmed;
}