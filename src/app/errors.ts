import {isRouteErrorResponse} from 'react-router';

export const describeError = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }
  if (error instanceof Error) {
    return error.stack ?? `${error.name}: ${error.message}`;
  }
  return String(error);
};

// The Maps loader includes the API key in its error messages, and error pages
// tend to end up in screenshots
export const redactKeys = (text: string) =>
  text
    .replace(/("apiKey"\s*:\s*")[^"]*/g, '$1[hidden]')
    .replace(/([?&]key=)[^&\s"]*/g, '$1[hidden]');

// A lazily loaded page whose file is gone, usually because a newer version of
// the app was deployed while this one was open
export const isStaleModule = (error: unknown) =>
  error instanceof Error
  && /dynamically imported module|importing a module script failed/i.test(error.message);
