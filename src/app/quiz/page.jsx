// "use client";
import Link from "next/link";
import { AnimalData } from "@/data/animalData";
import { SetValue } from "@/components/SetValue";
import { Footer } from "@/components/Fotter";

const QuizPage = async ({ searchParams }) => {
  // クエリから生物を確定させる
  const getNumber = await searchParams;
  // console.log(getNumber.id);
  const getAnimal = AnimalData.find(({ id }) => id === Number(getNumber.id));
  // console.log(getAnimal.name);

  return (
    <div>
      <div className="mt-10 w-full ">
        <div className="bg-yellow rounded-3xl size-52 mx-auto my-0 px-2.5 border-8 border-black flex p-1.5">
          <img
            className="object-contain object-center"
            src={getAnimal.src}
            alt={getAnimal.name}
          />
        </div>
      </div>
      <SetValue />
      <Footer />
    </div>
  );
};
export default QuizPage;
