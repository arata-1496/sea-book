"use client";

import { Suspense } from "react";
import { SetValue } from "@/components/SetValue";
import { Footer } from "@/components/Footer";
import useAnimal from "@/hooks/useAnimal";
import { useSearchParams } from "next/navigation";

const QuizContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { animal, loading, error } = useAnimal(id);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-blue">
        <p className="text-white font-black text-xl">よみこみちゅう...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-blue">
      <div className="flex-1 flex flex-col bg-blue-500 rounded-3xl mx-3 my-3 sm:mx-4 sm:my-4 border-4 border-black px-4 py-4 sm:px-6 sm:py-6 gap-4">
        {/* クイズタイトル帯 */}
        <div
          className="w-full h-16 sm:h-20 rounded-2xl border-4 border-black overflow-hidden flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)]"
          style={{
            backgroundImage: "url('/visual/bg-quiz.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="text-orange-500 text-3xl sm:text-4xl font-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)]">
            クイズ
          </span>
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

        {/* 回答エリア */}
        <SetValue animal={animal} id={id} />
      </div>
      <Footer back="start" />
    </div>
  );
};

const QuizPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-blue">
          <p className="text-white font-black text-xl">よみこみちゅう...</p>
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
};

export default QuizPage;
