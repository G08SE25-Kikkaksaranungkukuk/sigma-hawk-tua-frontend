import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  requirePassword?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  requirePassword = false,
}: ConfirmationDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const variantStyles = {
    danger: {
      button: "bg-red-500 hover:bg-red-600 text-white",
      icon: "text-red-500",
    },
    warning: {
      button: "bg-yellow-500 hover:bg-yellow-600 text-black",
      icon: "text-yellow-500",
    },
    default: {
      button: "bg-orange-500 hover:bg-orange-600 text-black",
      icon: "text-orange-500",
    },
  };

  const styles = variantStyles[variant];

  const handleConfirm = async () => {
    if (requirePassword && !password) {
      setError("Please enter your password to confirm");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("✅ Account deleted");
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setPassword("");
        setError("");
        onClose();
      }}
    >
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
            <DialogTitle className="text-white">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        {requirePassword && (
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter your password to confirm"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="bg-slate-800 border-slate-700 text-white"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )}

        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`flex-1 ${styles.button}`}
              disabled={loading}
            >
              {loading ? "Deleting..." : confirmText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
