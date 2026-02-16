"use client";

import { SetValue } from "@/components/SetValue";
import { Footer } from "@/components/Fotter";
import useAnimal from "@/hooks/useAnimal";
import { useSearchParams } from "next/navigation";

const QuizPage = () => {
  // クエリから生物を確定させる
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { animal, loading, error } = useAnimal(id);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <div className="mt-10 w-full ">
        <div className="bg-yellow rounded-3xl size-52 mx-auto my-0 px-2.5 border-8 border-black flex p-1.5">
          <img
            className="object-contain object-center"
            src={animal.image}
            alt={animal.name}
          />
        </div>
      </div>
      <SetValue animal={animal} id={id} />
      <Footer />
    </div>
  );
};
export default QuizPage;
