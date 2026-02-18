"use client";

import { Suspense } from "react";
import useAnimal from "@/hooks/useAnimal";
import { useSearchParams } from "next/navigation";
import { Frown } from "lucide-react";
import { Footer } from "@/components/Footer";

const ResultContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const queryCorrect = searchParams.get("correct");

  const { animal, loading, error } = useAnimal(id);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <div className="mt-10 w-full ">
        <div className="bg-yellow rounded-3xl size-52 mx-auto my-0 px-2.5 border-8 flex p-1.5">
          <img
            className="object-contain object-center"
            src={animal.image}
            alt={animal.name}
          />
        </div>
      </div>
      <div className="w-hull text-center ">
        <h1 className="text-3xl font-black text-white">{animal.name}</h1>
      </div>

      <div className="w-full">
        <div className="text-center mt-5 font-black text-5xl ">
          {queryCorrect === "true" ? (
            <h1 className=" animate-bounce text-orange">せいかい！</h1>
          ) : (
            <div className="flex">
              <h1>ざんねん</h1>
              <Frown />
            </div>
          )}
        </div>
      </div>
      <Footer page="result" />
    </div>
  );
};

const ResultPage = () => {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ResultContent />
    </Suspense>
  );
};

export default ResultPage;
