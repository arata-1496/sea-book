"use client";
import Link from "next/link";
import { AnimalData } from "@/data/animalData";
import { useSearchParams } from "next/navigation";

const ResultPage = () => {
  const seachParams = useSearchParams();
  const queryId = seachParams.get("id");
  const queryCorrect = seachParams.get("correct");

  const getAnimal = AnimalData.find(({ id }) => id === Number(queryId));

  return (
    <div>
      <div className="mt-10 w-full ">
        <div className="bg-yellow rounded-3xl size-52 mx-auto my-0 px-2.5 border-8 flex p-1.5">
          <img
            className="object-contain object-center"
            src={getAnimal.src}
            alt={getAnimal.name}
          />
        </div>
      </div>

      <div>{queryCorrect === "true" ? <h1>True</h1> : <h1>False</h1>}</div>
      <div className="mt-8 ml-3">
        <div>
          <button className="border-4 rounded-2xl bg-yellow text-3xl p-1 font-bold">
            <Link href="/quiz-start">やめる</Link>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ResultPage;
