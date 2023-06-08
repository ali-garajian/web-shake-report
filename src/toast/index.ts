import styles from "./styles.module.css";

type ToastOptions = {
  timeout?: number;
  variant?: "success" | "error";
};
const TOAST_TRANSITION_DURATION = 200;
const Toast = {
  visible: false,
  show(message: string, options?: ToastOptions) {
    if (!this.visible) {
      const { timeout = 2000, variant } = options || {};
      if (timeout < 0) {
        console.error("toast timeout must be a positive number");
        return;
      }
      this.visible = true;
      const toast = document.createElement("div");
      toast.style.transition = `transform ${TOAST_TRANSITION_DURATION}ms ease`;
      toast.classList.add(styles.toast);
      if (variant) {
        toast.classList.add(styles[variant]);
      }
      toast.innerHTML = message;
      document.body.append(toast);
      setTimeout(() => {
        toast.classList.add(styles.show);
      }, 0);

      const autoCloseTimeoutId = setTimeout(() => {
        close();
      }, timeout);

      const _this = this;
      function close() {
        clearTimeout(autoCloseTimeoutId);
        toast.classList.remove(styles.show);
        setTimeout(() => {
          toast.remove();
        }, TOAST_TRANSITION_DURATION);
        _this.visible = false;
      }

      return close;
    }
    return () => {};
  },
  success(message: string, options?: Omit<ToastOptions, "variant">) {
    return this.show(message, {
      ...options,
      variant: "success",
    });
  },
  error(message: string, options?: Omit<ToastOptions, "variant">) {
    return this.show(message, {
      ...options,
      variant: "error",
    });
  },
};

export { Toast };
export type { ToastOptions };
