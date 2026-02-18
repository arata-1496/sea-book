"use client";
import { useRouter } from "next/navigation";
import useAnimalId from "@/hooks/useAnimalId";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useUserStore from "@/store/userStore";

export default function StartPage() {
  const router = useRouter();
  const { animals, loading, error } = useAnimalId();

  const handleDecideAnimal = () => {
    const randomNum = Math.floor(Math.random() * animals.length);
    const animalNum = animals[randomNum].animal_id;
    const query = `/quiz/?id=${animalNum}`;
    router.push(query);
  };

  const userId = useUserStore((state) => state.userId);
  console.log(userId);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  //console　現在のユーザー確認用
  const data = JSON.parse(localStorage.getItem("user-storage"));
  console.log("現在のユーザー", data.state.userId);
  console.log("現在のユーザー", data.state.userName);
  localStorage.setItem("user-storage", JSON.stringify(data));

  return (
    <div className="flex flex-col h-full pt-20">
      <h1 className="text-4xl font-black text-black text-center  ">
        モードをえらんで
      </h1>

      <div className="my-auto mx-auto">
        <Button
          onClick={handleDecideAnimal}
          className="border-2 rounded-2xl border-black bg-orange text-4xl font-black text-black px-5 py-12"
        >
          クイズ
        </Button>
        <Button
          asChild
          className="border-2 rounded-2xl border-black bg-yellow text-4xl font-black text-black px-5 py-12"
        >
          <Link href="/book">ずかん</Link>
        </Button>
      </div>
      <Footer back="user" />
    </div>
  );
}

// ↓consoleで不要データを削除したいとき↓
// const data = JSON.parse(localStorage.getItem('user-storage'));
// data.state.registeredUsers = data.state.registeredUsers.filter(
//   (user) => user.userId !== null && user.userId !== 0
// );
