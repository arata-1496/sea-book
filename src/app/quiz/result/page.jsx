"use client";

import { Suspense } from "react";
import useAnimal from "@/hooks/useAnimal";
import { useSearchParams, useRouter } from "next/navigation";
import { Frown } from "lucide-react";
import { Footer } from "@/components/Footer";

// 紙吹雪パーツ
const Confetti = () => {
  const pieces = Array.from({ length: 30 });
  const colors = [
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-blue-400",
    "bg-pink-400",
    "bg-purple-400",
    "bg-orange-400",
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((_, i) => {
        const color = colors[i % colors.length];
        const left = `${Math.random() * 100}%`;
        const delay = `${Math.random() * 1.5}s`;
        const duration = `${1.5 + Math.random() * 1.5}s`;
        const size = Math.random() > 0.5 ? "w-3 h-3" : "w-2 h-4";
        return (
          <div
            key={i}
            className={`absolute ${color} ${size} rounded-sm opacity-90`}
            style={{
              left,
              top: "-10px",
              animation: `confettiFall ${duration} ${delay} ease-in forwards`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const ResultContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const queryCorrect = searchParams.get("correct");
  const isCorrect = queryCorrect === "true";
  const router = useRouter();

  const { animal, loading, error } = useAnimal(id);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-blue">
        <p className="text-white font-black text-xl">よみこみちゅう...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-blue relative">
      {/* 正解時の紙吹雪 */}
      {isCorrect && <Confetti />}

      <div className="flex-1 flex flex-col bg-blue-500 rounded-3xl mx-3 my-3 sm:mx-4 sm:my-4 border-4 border-black px-4 py-4 sm:px-6 sm:py-6 gap-4">
        {/* 正解・不正解バナー */}
        <div
          className={`w-full h-16 sm:h-20 rounded-2xl border-4 border-black flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)] ${isCorrect ? "bg-orange-400" : "bg-blue-300"}`}
        >
          {isCorrect ? (
            <h1 className="animate-bounce text-white text-3xl sm:text-4xl font-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              せいかい！
            </h1>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-white text-3xl sm:text-4xl font-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                ざんねん
              </h1>
              <Frown className="text-white w-8 h-8" />
            </div>
          )}
        </div>

        {/* 動物画像エリア */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-amber-50 rounded-3xl border-4 border-black p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] w-full max-w-xs sm:max-w-sm h-64 sm:h-72 flex items-center justify-center">
            <img
              className="object-contain w-full h-full"
              src={animal.image}
              alt={animal.name}
            />
          </div>
        </div>

        {/* 動物名 */}
        <div className="text-center">
          <h1 className="text-white text-3xl sm:text-4xl font-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            {animal.name}
          </h1>
        </div>

        {/* 正解時：aboutコメント吹き出し */}
        {isCorrect && animal.about && (
          <div className="relative bg-amber-50 border-4 border-black rounded-2xl px-4 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            {/* 吹き出しの三角 */}
            <div className="absolute -top-4 left-6 w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-black" />
            <div className="absolute -top-2.5 left-[26px] w-0 h-0 border-l-[7px] border-r-[7px] border-b-[14px] border-l-transparent border-r-transparent border-b-amber-50" />
            <p className="text-black font-bold text-sm sm:text-base text-center leading-relaxed">
              {animal.about}
            </p>
          </div>
        )}

        {/* 不正解時：もう一度チャレンジボタン */}
        {!isCorrect && (
          <button
            onClick={() => router.back()}
            className="w-full bg-orange-400 border-4 border-black rounded-full py-3 text-white font-black text-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all animate-bounce"
          >
            もう一度チャレンジ！
          </button>
        )}
      </div>
      <Footer page="result" />
    </div>
  );
};

const ResultPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-blue">
          <p className="text-white font-black text-xl">よみこみちゅう...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
};

export default ResultPage;
