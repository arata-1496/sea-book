"use client";
import { useRouter } from "next/navigation";
import useAnimals from "@/hooks/useAnimals";
import { Footer } from "@/components/Fotter";

export default function StartPage() {
  const router = useRouter();
  const { animals, loading, error } = useAnimals();
  // const setGuestUser = useUserStore((state) => state.setGuestUser); // ← 追加

  const handleDecideAnimal = () => {
    const randomNum = Math.floor(Math.random() * animals.length);
    const animalNum = animals[randomNum].animal_id;
    const query = `/quiz/?id=${animalNum}`;
    router.push(query);
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  //console　現在のユーザー確認用
  const data = JSON.parse(localStorage.getItem("user-storage"));
  console.log("現在のユーザー", data.state.userId);
  console.log("現在のユーザー", data.state.userName);
  localStorage.setItem("user-storage", JSON.stringify(data));

  return (
    <div className="h-screen flex">
      <div className="my-auto mx-auto ">
        <button
          onClick={handleDecideAnimal}
          className="border-4 rounded-2xl bg-yellow text-3xl p-1"
        >
          クイズをはじめる
        </button>
      </div>
    </div>
  );
}

// ↓consoleで不要データを削除したいとき↓
// const data = JSON.parse(localStorage.getItem('user-storage'));
// data.state.registeredUsers = data.state.registeredUsers.filter(
//   (user) => user.userId !== null && user.userId !== 0
// );
