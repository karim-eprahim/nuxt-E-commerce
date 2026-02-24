import type { APIError } from "~~/types";
import { toast } from "vue-sonner";

interface state {
  isLoading: boolean;
  appError: APIError | null;
}

const state = reactive<state>({
  isLoading: false,
  appError: null,
});

export default () => {
  const { isLoading, appError } = toRefs(state);

  const toggleLoading = (v: boolean) => {
    state.isLoading = v;
  };
  const toggleError = (error: APIError | null) => {
    state.appError = error;
  };
  // notification message handler
  const showError = (error: APIError) => {
    toast.error(error.statusCode + "", {
      description: error.message ? error.message : error.statusMessage, position: "top-right"
    });
  };

  const showMessage = (content: {
    title: string;
    description?: string;
    variant?: "default" | "destructive" | "warning" | "success" | "info" | null;
  }) => {
    const variant = content.variant;
    if (variant === "success") {
      toast.success(content.title, { description: content.description , position: "top-right" });
    } else if (variant === "destructive" || variant === "warning") {
      toast.error(content.title, { description: content.description , position: "top-right" });
    } else if (variant === "info") {
      toast.info(content.title, { description: content.description , position: "top-right" });
    } else {
      toast(content.title, { description: content.description , position: "top-right" });
    }
  };
  return {
    isLoading,
    appError,
    showError,
    showMessage,
    toggleLoading,
    toggleError,
  };
};
