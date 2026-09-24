import type { FC } from "react";
import './Alert.css'

export type AlertType = "success" | "danger" | "warning" | "info";

interface AlertProps {
  message: string;
  type?: AlertType;
  onClose: () => void;
}

const Alert: FC<AlertProps> = ({
  message,
  type = "success",
  onClose,
}) => {
  return (
    <div
      className={`alert alert-${type} alert-dismissible`}
      role="alert"
    >
      <div>{message}</div>

      <button
        type="button"
        className="btn-close-alert"
        aria-label="Close"
        onClick={onClose}
      >x</button>
    </div>
  );
};

export default Alert;
