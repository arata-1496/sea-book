"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function TestPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Toaster position="top-center" />

      <Button
        variant="outline"
        onClick={() =>
          toast.warning("このばんごうはつかわれているよ、、、", {
            duration: 1500,
          })
        }
      >
        試してみる
      </Button>
    </div>
  );
}
