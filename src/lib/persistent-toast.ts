import { toast } from "sonner";

const TOAST_STORAGE_KEY = "persistent_toasts";

export const addPersistentToast = (
  message: string,
  type: "success" | "error" | "info" = "info"
) => {
  // Store the toast in localStorage
  const existingToasts = JSON.parse(
    localStorage.getItem(TOAST_STORAGE_KEY) || "[]"
  );
  existingToasts.push({ message, type, timestamp: Date.now() });
  localStorage.setItem(TOAST_STORAGE_KEY, JSON.stringify(existingToasts));

  // Show the toast immediately
  //   switch (type) {
  //     case "success":
  //       toast.success(message);
  //       break;
  //     case "error":
  //       toast.error(message);
  //       break;
  //     default:
  //       toast(message);
  //   }
};

export const showPersistentToasts = () => {
  const storedToasts = JSON.parse(
    localStorage.getItem(TOAST_STORAGE_KEY) || "[]"
  );

  // Show all stored toasts
  storedToasts.forEach(
    (toastData: { message: string; type: string; timestamp: number }) => {
      switch (toastData.type) {
        case "success":
          toast.success(toastData.message);
          break;
        case "error":
          toast.error(toastData.message);
          break;
        default:
          toast(toastData.message);
      }
    }
  );

  // Clear stored toasts after showing them
  localStorage.removeItem(TOAST_STORAGE_KEY);
};
