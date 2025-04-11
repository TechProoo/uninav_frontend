"use client";

import React, { useState } from "react";
import { ApprovalStatusEnum } from "@/lib/types/response.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ReviewActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: ApprovalStatusEnum, comment: string) => Promise<void>;
  action: ApprovalStatusEnum;
  contentType: string; // "Material", "Blog", "Course", etc.
}

const ReviewActionDialog: React.FC<ReviewActionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  contentType,
}) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRejection = action === ApprovalStatusEnum.REJECTED;

  const handleConfirm = async () => {
    if (isRejection && !comment.trim()) {
      return; // Don't allow rejection without comment
    }

    setIsSubmitting(true);
    try {
      await onConfirm(action, comment);
      setComment(""); // Reset comment after successful submission
    } catch (error) {
      console.error("Error during review action:", error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === ApprovalStatusEnum.APPROVED ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Approve {contentType}</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span>Reject {contentType}</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === ApprovalStatusEnum.APPROVED
              ? `This ${contentType.toLowerCase()} will be approved and made available to all users.`
              : `This ${contentType.toLowerCase()} will be rejected and returned to the creator with your feedback.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label
            htmlFor="comment"
            className="block mb-1 font-medium text-gray-700 text-sm"
          >
            {isRejection ? (
              <span className="font-medium text-red-500">
                * Feedback required for rejection
              </span>
            ) : (
              "Comment (optional)"
            )}
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e: any) => setComment(e.target.value)}
            placeholder={
              isRejection
                ? `Please explain why this ${contentType.toLowerCase()} was rejected...`
                : `Optional comment about this ${contentType.toLowerCase()}...`
            }
            className={`w-full ${
              isRejection && !comment.trim() ? "border-red-300" : ""
            }`}
            rows={4}
          />
          {isRejection && !comment.trim() && (
            <p className="mt-1 text-red-500 text-sm">
              A comment explaining the reason for rejection is required.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={
              action === ApprovalStatusEnum.APPROVED ? "default" : "destructive"
            }
            onClick={handleConfirm}
            disabled={isSubmitting || (isRejection && !comment.trim())}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                {action === ApprovalStatusEnum.APPROVED
                  ? "Approving..."
                  : "Rejecting..."}
              </>
            ) : (
              <>
                {action === ApprovalStatusEnum.APPROVED ? "Approve" : "Reject"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewActionDialog;
