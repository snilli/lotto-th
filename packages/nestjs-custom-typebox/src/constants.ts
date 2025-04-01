export const HttpStatusInformationalDescription = {
	100: 'Continue',
	101: 'Switching Protocols',
	102: 'Processing',
	103: 'Early Hints',
} as const

export const HttpStatusSuccessfulDescription = {
	200: 'Ok',
	201: 'Created',
	202: 'Accepted',
	203: 'Non Authoritative Information',
	204: 'No Content',
	205: 'Reset Content',
	206: 'Partial Content',
	207: 'Multi Status',
	208: 'Already Reported',
	210: 'Content Different',
} as const

export const HttpStatusRedirectionDescription = {
	300: 'Ambiguous',
	301: 'Moved Permanently',
	302: 'Found',
	303: 'See Other',
	304: 'Not Modified',
	307: 'Temporary Redirect',
	308: 'Permanent Redirect',
} as const

export const HttpStatusClientErrorDescription = {
	400: 'Bad Request',
	401: 'Unauthorized',
	402: 'Payment Required',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	407: 'Proxy Authentication Required',
	408: 'Request Timeout',
	409: 'Conflict',
	410: 'Gone',
	411: 'Length Required',
	412: 'Precondition Failed',
	413: 'Payload Too Large',
	414: 'Uri Too Long',
	415: 'Unsupported Media Type',
	416: 'Requested Range Not Satisfiable',
	417: 'Expectation Failed',
	418: "I'm a teapot",
	421: 'Misdirected',
	422: 'Unprocessable Entity',
	423: 'Locked',
	424: 'Failed Dependency',
	428: 'Precondition Required',
	429: 'Too Many Requests',
	456: 'Unrecoverable Error',
} as const

export const HttpStatusServerErrorDescription = {
	500: 'Internal Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
	505: 'Http Version Not Supported',
	507: 'Insufficient Storage',
	508: 'Loop Detected',
} as const

export const HttpStatusDescription = {
	...HttpStatusInformationalDescription,
	...HttpStatusSuccessfulDescription,
	...HttpStatusRedirectionDescription,
	...HttpStatusClientErrorDescription,
	...HttpStatusServerErrorDescription,
}

export type HttpStatusCode = keyof typeof HttpStatusDescription

export const HttpStatusInformational = {
	CONTINUE: 100,
	SWITCHING_PROTOCOLS: 101,
	PROCESSING: 102,
	EARLY_HINTS: 103,
} as const

export const HttpStatusSuccessful = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NON_AUTHORITATIVE_INFORMATION: 203,
	NO_CONTENT: 204,
	RESET_CONTENT: 205,
	PARTIAL_CONTENT: 206,
	MULTI_STATUS: 207,
	ALREADY_REPORTED: 208,
	CONTENT_DIFFERENT: 210,
} as const

export const HttpStatusRedirection = {
	AMBIGUOUS: 300,
	MOVED_PERMANENTLY: 301,
	FOUND: 302,
	SEE_OTHER: 303,
	NOT_MODIFIED: 304,
	TEMPORARY_REDIRECT: 307,
	PERMANENT_REDIRECT: 308,
} as const

export const HttpStatusClientError = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	PAYLOAD_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	REQUESTED_RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	I_AM_A_TEAPOT: 418,
	MISDIRECTED: 421,
	UNPROCESSABLE_ENTITY: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	UNRECOVERABLE_ERROR: 456,
} as const

export const HttpStatusServerError = {
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
} as const

export const HttpStatus = {
	...HttpStatusInformational,
	...HttpStatusSuccessful,
	...HttpStatusRedirection,
	...HttpStatusClientError,
	...HttpStatusServerError,
}

export type HttpSuccessfulStatusMessages = keyof typeof HttpStatusSuccessful
export type HttpStatusMessages = keyof typeof HttpStatus

export type MergeEnumKeys<T extends object[]> = T extends [infer F, ...infer R extends object[]]
	? keyof F | MergeEnumKeys<R>
	: never
