import '../styles/components/error.scss';
import type { ReactNode } from "react";

type ErrorMessageProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  action?: ReactNode;
};

export default function ErrorMessage({
  title = "Oops!",
  message,
  onRetry,
  action,
}: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert" aria-live="polite">
      <div className="error-text">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="error-message-actions">
          {onRetry && (
            <button type="button" className="btn btn-primary btn-retry" onClick={onRetry}>
              Try again
            </button>
          )}

          {action}
        </div>
      </div>
    </div>
  );
}
