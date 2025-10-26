export const HttpCode = {
  // 2xx Success
  success: 200,
  created: 201,
  accepted: 202,
  noContent: 204,

  // 3xx Redirection
  movedPermanently: 301,
  found: 302,
  notModified: 304,

  // 4xx Client Error
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,

  // 5xx Server Error
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
} as const;

export type HttpCodeKey = keyof typeof HttpCode;
export type HttpCodeValue = (typeof HttpCode)[HttpCodeKey];

export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
  HEAD: "HEAD",
} as const;

export type HttpMethodKey = keyof typeof HttpMethod;
export type HttpMethodValue = (typeof HttpMethod)[HttpMethodKey];
