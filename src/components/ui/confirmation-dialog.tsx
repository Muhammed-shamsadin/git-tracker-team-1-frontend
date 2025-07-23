"use client";

import * as React from "react";
import { Button } from "./button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./dialog";
import { AlertTriangle } from "lucide-react";

export interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
    isLoading?: boolean;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    onConfirm,
    isLoading = false,
}: ConfirmationDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleConfirm = async () => {
        try {
            setIsSubmitting(true);
            await onConfirm();
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div
                            className={`p-2 rounded-full ${
                                variant === "destructive"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-primary/10 text-primary"
                            }`}
                        >
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <DialogTitle className="font-semibold text-lg">
                            {title}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="pt-2 text-left">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting || isLoading}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={
                            variant === "destructive"
                                ? "destructive"
                                : "default"
                        }
                        onClick={handleConfirm}
                        disabled={isSubmitting || isLoading}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting || isLoading ? (
                            <>
                                <span className="mr-2 w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
