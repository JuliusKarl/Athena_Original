/**
 * This is the standard response returned by the backend when a HTTP 4xx/5xx error happened.
 *
 * It is a Typescript translation of the Java class: nz.ac.auckland.athena.exceptions.ErrorResponse in api-athena-v1
 */
export interface BackendErrorResponse {
  timestamp: string;

  /** HTTP Status Code */
  status: number;

  /** HTTP Reason phrase */
  error: string;

  /** A message that describe the error thrown when calling the underlying API */
  message: string;

  /** Use this field when there are more than one error to display at a time */
  messages: string[];

  /** Downstream API name that has been called by this application */
  api: string;

  /** URI that has been called */
  path: string;
}
