"use client";
import useAnimalAll from "@/hooks/useAnimalAll";
import { useState } from "react";
import useCorrectAnimals from "@/hooks/useCorrectAnimals";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Footer } from "@/components/Footer";

export default function bookPage() {
  //shadcn用
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnimal, setIsAnimal] = useState({});
  //hook用
  const { animals, loading, error } = useAnimalAll();

  const handleAnimalDetail = (animal) => {
    setIsAnimal(animal);
    setIsDialogOpen(true);
  };
  const { correctAnimals } = useCorrectAnimals();
  console.log("correctAnimals:", correctAnimals);

  const checkList = correctAnimals.some(
    (item) => item.animal_id === animals.animal_id,
  );
  console.log("checkList", checkList);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="p-2 flex flex-col h-full ">
      <h1 className="text-center font-black text-6xl mb-4">ずかん</h1>
      <div className="flex-1 overflow-y-auto">
        <div className="w-fit mx-auto  grid gap-3 grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5">
          {animals.map((animal) => {
            const isCorrect = correctAnimals.some(
              (item) => item.animal_id === animal.animal_id,
            );
            console.log("isCorrect", isCorrect);
            if (isCorrect) {
              return (
                <div
                  key={animal.animal_id}
                  className="w-28 h-28 border-4 border-black  bg-yellow rounded-3xl flex justify-center items-center overflow-hidden p-2 "
                  onClick={() => handleAnimalDetail(animal)}
                >
                  <img
                    src={animal.image}
                    alt={animal.name}
                    className="object-contain object-center max-w-24 max-h-24"
                  />
                </div>
              );
            } else {
              return (
                <div
                  key={animal.animal_id}
                  className="w-28 h-28 border-4 border-black  bg-yellow rounded-3xl flex justify-center items-center overflow-hidden p-2 "
                >
                  <img
                    src="/hatena.png"
                    alt="hatena"
                    className="object-contain object-center max-w-24 max-h-24"
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAnimal.name}</DialogTitle>
            <DialogDescription>
              <img src={isAnimal.image} />
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
            <h1>{isAnimal.comment}</h1>
          </div>
        </DialogContent>
      </Dialog>
      <Footer back="start" />
    </div>
  );
}
