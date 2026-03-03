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

export default function BookPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnimal, setIsAnimal] = useState({});
  const { animals, loading, error } = useAnimalAll();
  const { correctAnimals } = useCorrectAnimals();

  const handleAnimalDetail = (animal) => {
    setIsAnimal(animal);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-blue">
        <p className="text-white font-black text-xl">よみこみちゅう...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-blue">
      <div className="flex-1 flex flex-col bg-blue-500 rounded-3xl mx-3 my-3 border-4 border-black overflow-hidden px-4 py-5 gap-4">
        {/* タイトル */}
        <h1 className="text-white text-3xl sm:text-4xl font-black text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          いきものずかん
        </h1>

        {/* グリッド */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="grid gap-3 grid-cols-3 sm:grid-cols-5 md:grid-cols-6 place-items-center w-full px-1 pb-1">
            {animals.map((animal) => {
              const isCorrect = correctAnimals.some(
                (item) => item.animal_id === animal.animal_id,
              );
              const isCorrectR =
                correctAnimals.filter(
                  (item) => item.animal_id === animal.animal_id,
                ).length >= 10;

              return (
                <div
                  key={animal.animal_id}
                  className={`w-full aspect-square border-4 border-black rounded-3xl flex justify-center items-center overflow-hidden p-2 shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all
                    ${isCorrect ? "active:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer" : "cursor-default"}
                    ${isCorrectR && animal.image_R !== null ? "bg-green-200" : "bg-yellow-100"}`}
                  onClick={
                    isCorrect ? () => handleAnimalDetail(animal) : undefined
                  }
                >
                  <img
                    src={
                      isCorrectR && animal.image_R !== null
                        ? animal.image_R
                        : isCorrect
                          ? animal.image
                          : "/hatena.png"
                    }
                    alt={isCorrect ? animal.name : "？"}
                    className="object-contain w-full h-full"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl border-4 border-black bg-amber-50 max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-black">
              {isAnimal.name}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col items-center gap-3 mt-2">
                <div className="w-40 h-40 flex items-center justify-center">
                  <img
                    src={
                      correctAnimals.filter(
                        (item) => item.animal_id === isAnimal.animal_id,
                      ).length >= 10 && isAnimal.image_R !== null
                        ? isAnimal.image_R
                        : isAnimal.image
                    }
                    alt={isAnimal.name}
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* 回答数バッジ */}
                <div className="bg-blue-100 border-2 border-black rounded-full px-5 py-1">
                  <span className="font-black text-black text-sm">
                    かいとうすう：
                    {
                      correctAnimals.filter(
                        (item) => item.animal_id === isAnimal.animal_id,
                      ).length
                    }
                    かい
                  </span>
                </div>

                {/* コメント */}
                <div className="bg-white border-2 border-black rounded-2xl px-4 py-3 w-full">
                  <p className="font-bold text-black text-sm leading-relaxed">
                    {isAnimal.comment}
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Footer back="start" />
    </div>
  );
}
