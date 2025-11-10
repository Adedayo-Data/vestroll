"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ModalDdntGetEmailProps {
  open: boolean;
  onClose?: () => void;
}

export default function ModalDdntGetEmail({
  open,
  onClose,
}: ModalDdntGetEmailProps) {
  const [isOpen, setOpen] = useState(open);

  // Sync internal state with prop changes
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white rounded-2xl p-8 w-full max-w-md">
        <button
          onClick={handleClose}
          className="bg-transparent border-0 cursor-pointer absolute top-4 left-4"
        >
          <X className="size-8 text-text-header" />
        </button>

        <AlertDialogHeader className="w-ful">
          <Image
            src="/IconDidnt.png"
            alt="didn't"
            width={120}
            height={120}
            className="mx-auto mb-5 mt-12"
          />
          <AlertDialogTitle className="font-bold text-[28px] text-text-header text-left w-full px-2">
            Didn&apos;t Get the Email?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-medium text-xs mx-10 text-text-subtext text-left w-full px-2">
            <ul className="text-[12px] space-y-2 list-disc text-left">
              <li>
                Check your spam or junk folder - sometimes, emails get filtered.
              </li>
              <li>Wait a few minutes - It may take a moment to arrive</li>
              <li>Resend the email - Tap the button to send it again</li>
              <li>
                Check if your email is correct - Sometimes, we make mistakes
              </li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 !justify-center">
          <AlertDialogAction
            className="bg-primary-500 hover:bg-primary-500/80 w-full text-base text-gray-50 rounded-[12px] h-14 font-medium"
            onClick={handleClose}
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
