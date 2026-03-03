"use client";

import { useState } from "react";
import useUserStore from "@/store/userStore";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/Footer";

export default function ReturnPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const addRegisteredUser = useUserStore((state) => state.addRegisteredUser);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isButtonDisabled = () => {
    const isNumberValid = /^\d{4}$/.test(userId);
    const isTextValid = name.trim() !== "";
    return !(isNumberValid && isTextValid);
  };

  const handleConfirm = async () => {
    const { data: returnUser } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .eq("user_id", userId);
    if (returnUser.length === 0) {
      toast.warning('"なまえ" か "ばんごう" がちがうよ', { duration: 2000 });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleRegister = () => {
    setUser(Number(userId), name);
    addRegisteredUser(Number(userId), name);
    router.push("/start");
  };

  return (
    <div className="flex flex-col h-full">
      <Toaster position="top-center" />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-blue p-4">
          <div className="flex flex-col bg-blue-400 rounded-3xl border-4 border-black px-6 py-6 gap-5 w-full max-w-xs sm:max-w-sm md:max-w-md">
            {/* タイトル */}
            <h1 className="text-white text-2xl sm:text-3xl font-black text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              さいログイン
            </h1>

            {/* 説明文 */}
            <p className="text-white text-center text-xs sm:text-sm font-bold leading-relaxed">
              とうろくした「なまえ」と
              <br />
              「４つのすうじ」をいれてね！
            </p>

            {/* 入力フォーム */}
            <div className="bg-amber-50 rounded-2xl border-4 border-black px-4 py-4 sm:px-6 sm:py-6 flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center gap-3">
                <label className="text-black font-black text-sm sm:text-base shrink-0">
                  なまえ
                </label>
                <input
                  type="text"
                  className="min-w-0 flex-1 bg-gray-200 rounded-full border-2 border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 text-black font-bold text-sm focus:outline-none focus:border-blue-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-black font-black text-sm sm:text-base shrink-0">
                  ばんごう(4つ)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="1234"
                  className="min-w-0 flex-1 bg-gray-200 rounded-full border-2 border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 text-black font-bold text-sm focus:outline-none focus:border-blue-400"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-center">
              <button
                onClick={handleConfirm}
                disabled={isButtonDisabled()}
                className="w-full bg-red-400 border-4 border-black rounded-full py-2.5 sm:py-3 text-white font-black text-sm sm:text-base shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                かくにん
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* モーダル */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl border-4 border-black bg-amber-50 max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-black">
              このなまえとばんごうでいい？
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-4">
                  <span className="font-black text-black shrink-0">なまえ</span>
                  <span className="min-w-0 flex-1 bg-gray-200 rounded-xl px-3 py-2 font-bold text-black text-center">
                    {name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-black shrink-0">
                    ばんごう(4つ)
                  </span>
                  <span className="min-w-0 flex-1 bg-gray-200 rounded-xl px-3 py-2 font-bold text-black text-center">
                    {userId}
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 mt-2">
            <button
              onClick={handleRegister}
              className="w-full bg-red-400 border-4 border-black rounded-full py-3 text-white font-black text-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              OK！
            </button>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="w-full bg-teal-400 border-4 border-black rounded-full py-2 text-white font-black text-base shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              もどる
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer back="user" />
    </div>
  );
}
