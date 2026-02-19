"use client";

import { useState } from "react";
import useUserStore from "@/store/userStore";
import { Button } from "@/components/ui/button";
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
  //router
  const router = useRouter();
  //zustand
  const setUser = useUserStore((state) => state.setUser);
  const addRegisteredUser = useUserStore((state) => state.addRegisteredUser);
  //input入力管理用
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  //shadcn用
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //ー入力が正しければボタン押せるようになるー
  const isButtonDisabled = () => {
    const isNumberValid = /^\d{4}$/.test(userId);
    const isTextValid = name.trim() !== "";
    return !(isNumberValid && isTextValid);
  }; //ーーーーーーーーーーーーーーーーーー

  //ーー確認ボタンを押したら。。。ーー
  const handleConfirm = async () => {
    //既存データ内から再ログイン者取得
    const { data: returnUser } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .eq("user_id", userId);
    // 合わない場合のトースト
    if (returnUser.length === 0) {
      toast.warning('"なまえ" か "ばんごう" がちがうよ', {
        duration: 2000,
      });
      return;
    }
    //モーダルを表示
    setIsDialogOpen(true);
  }; //ーーーーーーーーーーーーーーーーーー

  //登録ボタンを押したら。。。
  const handleRegister = () => {
    setUser(Number(userId), name);
    addRegisteredUser(Number(userId), name);
    router.push("/start");
  }; //ーーーーーーーーーーーーーーーーーー
  return (
    <div className="flex flex-col h-full">
      <div>
        <Toaster position="top-center" />
      </div>
      <div className="flex-1">
        <div className="">
          <div className="">
            <h1>再ログイン</h1>
            <h1>とうろくした”なまえ” と ”４つのすうじ” をいれてね！</h1>
            <div className="flex gap-2">
              <label htmlFor="name">なまえ:</label>
              <input
                type="text"
                className="bg-white rounded border-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <label htmlFor="name">ばんごう:</label>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="4つのすうじ"
                className="bg-white rounded border-black"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <Button onClick={handleConfirm} disabled={isButtonDisabled()}>
              かくにん
            </Button>
          </div>
        </div>
        {/* モーダル表示用 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>かくにん</DialogTitle>
              <DialogDescription>
                なまえ: {name}
                ばんごう: {userId}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>もどる</Button>
              <Button onClick={handleRegister}>OK!</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Footer back="user" />
      </div>
    </div>
  );
}
