"use client";

import { useEffect, useState } from "react";
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
import Link from "next/link";

export default function UserPage() {
  //router
  const router = useRouter();
  //zustand
  const setGuestUser = useUserStore((state) => state.setGuestUser);
  const setUser = useUserStore((state) => state.setUser);
  const addRegisteredUser = useUserStore((state) => state.addRegisteredUser);
  const registeredUsers = useUserStore((state) => state.registeredUsers);
  const [showRegistererForm, setShowRegistererForm] = useState(true);
  //input入力管理用
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  //shadcn用
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //読み込んだら。。。
  useEffect(() => {
    setShowRegistererForm(registeredUsers.length === 0);
  }, [registeredUsers]);

  //入力が正しければボタン押せるようになる
  const isButtonDisabled = () => {
    const isNumberValid = /^\d{4}$/.test(userId);
    const isTextValid = name.trim() !== "";
    return !(isNumberValid && isTextValid);
  }; //ーーーーーーーーーーーーーーーーーー

  //ーー確認ボタンを押したら。。。ーー
  const handleConfirm = async () => {
    //既存データ取得
    const { data: existingUsers } = await supabase
      .from("users")
      .select("user_id");

    //既存データと登録idを参照
    const isDuplicate = existingUsers.some(
      (user) => user.user_id === Number(userId),
    );
    if (isDuplicate) {
      toast.warning("このばんごうはつかわれているよ、、、", {
        duration: 1500,
      });
      return;
    }
    //モーダルを表示
    setIsDialogOpen(true);
  }; //ーーーーーーーーーーーーーーーーーー

  //登録ボタンを押したら。。。
  const handleRegister = async () => {
    //usersテーブルに登録
    const { error: insertError } = await supabase.from("users").insert({
      user_id: Number(userId),
      name: name,
    });
    //登録エラー
    if (insertError) {
      if (insertError.code === "23505") {
        // PRIMARY KEY 違反 = 重複
        toast.warning("このばんごうはつかわれているよ、、、", {
          duration: 1500,
        });
        setIsDialogOpen(false);
        return;
      }
      console.error("登録エラー:", insertError);
      toast.error("とうろくにしっぱいしました", {
        duration: 3000,
      });
      return;
    }
    // zustandに保存
    setUser(Number(userId), name);
    addRegisteredUser(Number(userId), name);
    router.push("/start");
  }; //ーーーーーーーーーーーーーーーーーー

  //ゲストボタンを押したら。。。
  const handleGuestStart = async () => {
    await setGuestUser();
    const data = JSON.parse(localStorage.getItem("user-storage"));
    console.log("ゲストID：", data.state.userId);
    console.log("ローカル登録ID数：", data.state.registeredUsers.length);
    router.push("/start");
  }; //ーーーーーーーーーーーーーーーーーー

  //ユーザーボタンを押したら。。。
  const handleUserStart = (userId, userName) => {
    setUser(userId, userName);
    router.push("/start");
  }; //ーーーーーーーーーーーーーーーーーーーー
  return (
    <div className="flex flex-col h-full">
      <div>
        <Toaster position="top-center" />
      </div>
      <div className="flex-1">
        {showRegistererForm ? (
          <div className="">
            <div className="">
              <h1>だれがあそぶ？</h1>
              <h1>
                なまえとばんごうをとうろくしておけば、
                <br />
                とちゅうからやり直せるよ！
              </h1>
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
                <label for="name">ばんごう:</label>
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

              <Button onClick={() => setShowRegistererForm(false)}>
                もどる
              </Button>
              <Button onClick={handleConfirm} disabled={isButtonDisabled()}>
                かくにん
              </Button>
              <h1>OR</h1>
              <Button onClick={handleGuestStart}>ゲストとしてはじめる</Button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-5xl font-bold text-white">だれがあそぶ？</h1>
            <div className="">
              {registeredUsers.map((data) => (
                <Button
                  onClick={() => handleUserStart(data.userId, data.userName)}
                  key={data.userId}
                  className="bg-orange font-black text-2xl border-4 border-black"
                >
                  {data.userName}
                </Button>
              ))}
            </div>
            <Button
              className="bg-sky-300 font-bold  border-4 border-black"
              onClick={() => setShowRegistererForm(true)}
            >
              あたらしくとうろく
            </Button>

            <Button
              className="bg-sky-300 font-bold  border-4 border-black"
              onClick={handleGuestStart}
            >
              ゲストとしてはじめる
            </Button>
            <div>
              <Link className=" font-bold text-white" href="/user/return">
                再ログイン
              </Link>
            </div>
          </div>
        )}
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
            <Button onClick={handleRegister}>とうろく</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer back="" />
    </div>
  );
}
