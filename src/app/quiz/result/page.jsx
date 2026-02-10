"use client";
import Link from "next/link";
import { AnimalData } from "@/data/animalData";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Frown } from "lucide-react";
import { Footer } from "@/components/Fotter";

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
      <div className="w-hull text-center ">
        <h1 className="text-3xl font-black text-white">{getAnimal.name}</h1>
      </div>

      <div className="w-full">
        <div className="text-center mt-5 font-black text-5xl ">
          {queryCorrect === "true" ? (
            <h1 className=" animate-bounce text-orange">せいかい！</h1>
          ) : (
            <>
              <h1>ざんねん</h1>
              <Frown />
            </>
          )}
        </div>
      </div>
      <Footer page="result" />
    </div>
  );
};
export default ResultPage;
