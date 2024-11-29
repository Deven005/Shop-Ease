// utils.ts
import { toast } from "react-toastify";

// Define a utility function to show different types of toast notifications
const showToast = (
  message: string,
  type: "success" | "error" | "info" = "info"
) => {
  // Set the toast options
  const options = {
    position: "top-right" as const,
    autoClose: 5000, // Auto-close after 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Show different types of toasts based on the type argument
  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
};

export { showToast };
