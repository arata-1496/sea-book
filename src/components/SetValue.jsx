"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimalData } from "@/data/animalData";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const SetValue = () => {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");

  const seachParams = useSearchParams();
  const queryId = seachParams.get("id");
  const router = useRouter();

  // 入力欄の作成
  const handleClick = () => {
    if (inputValue === null) return;
    setOutput(inputValue);
    setInputValue("");
  };
  const handleCansellClick = () => {
    setOutput("");
  };

  const handleClickResult = () => {
    const getAnimal = AnimalData.find(({ id }) => id === Number(queryId));
    let resultQuery = "";
    if (getAnimal.name === output) {
      resultQuery = `/quiz/result?id=${queryId}&correct=true`;
    } else {
      resultQuery = `/quiz/result?id=${queryId}&correct=false`;
    }
    router.push(resultQuery);
  };

  return (
    <div>
      <div className="flex w-auto justify-center m-2">
        <div className="border-4 rounded-2xl bg-yellow text-center h-10 w-28">
          {output ? (
            <div className="text-xl text-black font-black">
              {output && <h1>{output}</h1>}
            </div>
          ) : (
            <h1 className="text-blue-800 text-xl font-black">{inputValue}</h1>
          )}
        </div>
      </div>
      <div className="w-auto justify-center flex">
        {output ? (
          <div>
            <button
              className="border-4 rounded-2xl bg-skyblue text-center h-10 w-28 mx-1"
              onClick={handleCansellClick}
            >
              やりなおす
            </button>
            <button
              onClick={handleClickResult}
              className="border-4 rounded-2xl bg-orange text-center h-10 w-28 mx-1"
            >
              <Link href={""}>けってい</Link>
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              className="border border-gray-300 rounded p-2 w-48 mb-4 text-black"
              placeholder="(ひらがな)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="bg-yellow rounded-3xl w-28 px-2.5 border-8 p-1.5 hover:bg-blue-700 font-black"
              onClick={handleClick}
            >
              きめた
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
