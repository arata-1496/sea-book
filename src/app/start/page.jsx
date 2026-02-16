"use client";
import { useRouter } from "next/navigation";
import useAnimals from "@/hooks/useAnimals";
import useUserStore from "@/store/userStore"; // ← 追加

export default function StartPage() {
  const router = useRouter();
  const { animals, loading, error } = useAnimals();
  const setGuestUser = useUserStore((state) => state.setGuestUser); // ← 追加

  const handleDecideAnimal = () => {
    // ← ここに追加
    setGuestUser(); // ゲストユーザーを設定
    console.log("ゲストID設定完了");

    const randomNum = Math.floor(Math.random() * animals.length);
    const animalNum = animals[randomNum].animal_id;
    const query = `/quiz/?id=${animalNum}`;
    router.push(query);
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="h-screen flex">
      <div className="my-auto mx-auto ">
        <button
          onClick={handleDecideAnimal}
          className="border-4 rounded-2xl bg-yellow text-3xl p-1"
        >
          はじめる
        </button>
      </div>
    </div>
  );
}
