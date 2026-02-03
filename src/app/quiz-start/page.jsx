"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuizStartPage() {
  //useRouterを定義
  const router = useRouter();

  //ランダム数字をurlのクエリに入れる関数
  const handleDecideAnimal = () => {
    const randamNum = Math.floor(Math.random() * 10) + 1; //id分 (*▫️)を変更する
    const query = `/quiz/?id=${randamNum}`;
    router.push(query);
  };

  return (
    <div className="h-screen flex">
      <div className="my-auto mx-auto ">
        <button
          onClick={handleDecideAnimal}
          className="border-4 rounded-2xl bg-yellow text-3xl p-1"
        >
          <Link href="/quiz">はじめる</Link>
        </button>
      </div>
    </div>
  );
}
