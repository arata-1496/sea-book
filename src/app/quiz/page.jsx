import Link from "next/link";
import { AnimalData } from "@/data/animalData";

const QuizPage = async ({ searchParams }) => {
  const getNumber = await searchParams;
  console.log(getNumber.id);
  const getAnimal = AnimalData.find(({ id }) => id === getNumber.id);
  console.log(getAnimal);

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
      <div className="mt-8 ml-3">
        <div>
          <button className="border-4 rounded-2xl bg-yellow text-3xl p-1 font-bold">
            <Link href="quiz-start">もどる</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

// export default function QuizPage() {
//   return (
//     <div>
//       <div className="mt-10 w-full ">
//         <div className="bg-yellow rounded-3xl size-52 mx-auto my-0 px-2.5 border-8 flex p-1.5">
//           <img
//             className="object-contain object-center"
//             src="/animals/ebi1.png"
//             alt="えび"
//           />
//         </div>
//       </div>
//       <div className="mt-8 ml-3">
//         <div>
//           <button className="border-4 rounded-2xl bg-yellow text-3xl p-1 font-bold">
//             <Link href="quiz-start">もどる</Link>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
