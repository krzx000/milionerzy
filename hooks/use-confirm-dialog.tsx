import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

interface ConfirmDialogState {
  open: boolean;
  options: ConfirmDialogOptions | null;
  resolve: ((value: boolean) => void) | null;
}

export function useConfirmDialog() {
  const [state, setState] = React.useState<ConfirmDialogState>({
    open: false,
    options: null,
    resolve: null,
  });

  const confirm = React.useCallback(
    (options: ConfirmDialogOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          open: true,
          options,
          resolve,
        });
      });
    },
    []
  );

  const handleConfirm = React.useCallback(() => {
    if (state.resolve) {
      state.resolve(true);
    }
    setState({ open: false, options: null, resolve: null });
  }, [state]);

  const handleCancel = React.useCallback(() => {
    if (state.resolve) {
      state.resolve(false);
    }
    setState({ open: false, options: null, resolve: null });
  }, [state]);

  const dialog = state.options && (
    <AlertDialog
      open={state.open}
      onOpenChange={(open) => {
        if (!open && state.resolve) {
          state.resolve(false);
          setState({ open: false, options: null, resolve: null });
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state.options.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {state.options.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {state.options.cancelText || "Anuluj"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              state.options.variant === "destructive"
                ? "bg-red-600 hover:bg-red-700"
                : ""
            }
          >
            {state.options.confirmText || "Potwierdź"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, dialog };
}
