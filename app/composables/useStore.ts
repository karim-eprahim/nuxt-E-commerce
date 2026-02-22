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
    toast({
      variant: "destructive",
      title: error.statusCode + "",
      description: error.message ? error.message : error.statusMessage,
    });
  };

  const showMessage = (content: {
    title: string;
    description: string;
    variant:
      | "default"
      | "destructive"
      | "warning"
      | "success"
      | "info"
      | null
      | undefined;
  }) => {
    toast({
      variant: content.variant,
      title: content.title,
      description: content.description,
    });
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
