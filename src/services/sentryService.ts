import * as Sentry from '@sentry/react';
import { INTEGRATIONS } from '../config/integrations';

export const initSentry = () => {
  Sentry.init({
    dsn: INTEGRATIONS.SENTRY.DSN,
    environment: INTEGRATIONS.SENTRY.ENVIRONMENT,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

export const captureError = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    contexts: { additional: context }
  });
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level);
};