"use client";
import { useRouter } from "next/navigation";
import useAnimalId from "@/hooks/useAnimalId";
import { Footer } from "@/components/Footer";
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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-blue">
        <p className="text-white font-black text-xl">よみこみちゅう...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-blue">
      <div className="flex-1 flex flex-col bg-blue-500 rounded-3xl mx-3 my-3 sm:mx-4 sm:my-4 border-4 border-black px-4 py-6 sm:px-6 sm:py-8 justify-center">
        <div className="flex flex-col gap-20 sm:gap-20 mt-[10%]">
          {/* タイトル */}
          <h1 className="text-white text-5xl sm:text-6xl font-black text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            どれにする？
          </h1>

          {/* ボタンエリア */}
          <div className="flex flex-col gap-17 sm:gap-20">
            {/* クイズボタン */}
            <button
              onClick={handleDecideAnimal}
              className="relative w-full h-32 sm:h-40 rounded-2xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              style={{
                backgroundImage: "url('/visual/bg-quiz.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span className="relative z-10 text-orange-500 text-4xl sm:text-5xl font-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)]">
                クイズ
              </span>
            </button>

            {/* ずかんボタン */}
            <Link
              href="/book"
              className="relative w-full h-32 sm:h-40 rounded-2xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center"
              style={{
                backgroundImage: "url('/visual/bg-book.jpg')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
              }}
            >
              <span className="relative z-10 text-teal-500 text-4xl sm:text-5xl font-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)]">
                ずかん
              </span>
            </Link>
          </div>
        </div>
      </div>

      <Footer back="user" />
    </div>
  );
}
