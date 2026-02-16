"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";

export default function UserPage() {
  const registeredUsers = useUserStore((state) => state.registeredUsers);
  console.log("registeredUsers:", registeredUsers); // ← 追加
  console.log("length:", registeredUsers.length);
  const [showRegistererForm, setShowRegistererForm] = useState(true);

  useEffect(() => {
    setShowRegistererForm(registeredUsers.length === 0);
  }, [registeredUsers]);
  return (
    <div>
      <div>
        {showRegistererForm ? (
          <div>
            <h1>ユーザー登録</h1>
            {/* 登録フォーム作成 */}
          </div>
        ) : (
          <div>
            <h1>ユーザー選択</h1>
            <button onClick={() => setShowRegistererForm(true)}>
              新しく登録
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
