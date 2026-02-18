"use client";
import { ArrowBigLeftDash, CircleArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAnimalId from "@/hooks/useAnimalId";

export const Footer = ({ page, back }) => {
  //useRouterを定義
  const router = useRouter();

  const { animals, loading, error } = useAnimalId();

  //ランダム数字をurlのクエリに入れる関数
  const handleDecideAnimal = () => {
    const randomNum = Math.floor(Math.random() * animals.length); //id分 (*▫️)を変更する
    const animalNum = animals[randomNum].animal_id;
    const query = `/quiz/?id=${animalNum}`;
    router.push(query);
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }
  return (
    <>
      {page === "result" ? (
        <div>
          <div className="w-full pb-2 pl-2">
            <div className="w-full lg:w-3xl p-5">
              <div className="flex justify-between mt-3">
                {/* ボタン */}
                <button className="border-4 border-black rounded-2xl bg-yellow text-3xl p-1 font-bold">
                  <Link href="/start" className="flex items-center">
                    <ArrowBigLeftDash className="w-8 h-auto" />
                    <h1>やめる</h1>
                  </Link>
                </button>
                {/* ボタン */}
                <button className="border-4 border-black rounded-2xl bg-orange text-3xl p-1 font-bold">
                  <button
                    href="/quiz"
                    className="flex items-center"
                    onClick={handleDecideAnimal}
                  >
                    <h1>つぎへ</h1>
                    <CircleArrowRight className="w-8 h-auto" />
                  </button>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full flex pb-2 pl-2 ">
            <div className="w-full lg:w-3xl m-auto">
              <button className="border-4 border-black rounded-2xl bg-yellow text-3xl p-1 font-bold">
                <Link href={`/${back}`} className="flex items-center">
                  <ArrowBigLeftDash className="w-8 h-auto" />
                  <h1>やめる</h1>
                </Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
