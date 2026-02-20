"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import useUserStore from "@/store/userStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Button } from "./ui/button";
import { Mic, SquareStop } from "lucide-react";

export const SetValue = ({ animal, id }) => {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const userId = useUserStore((state) => state.userId);
  const router = useRouter();
  const { isListening, transcript, handleMicClick } = useSpeechRecognition();

  useEffect(() => {
    if (transcript !== "") {
      setOutput(transcript);
    }
  }, [transcript]);

  // 入力欄の作成
  const handleClick = () => {
    if (inputValue === null) return;
    setOutput(inputValue);
    setInputValue("");
  };
  const handleCancelClick = () => {
    setOutput("");
  };

  const handleClickResult = async () => {
    const isCorrect = animal.name === output;

    const { error } = await supabase.from("animal_answers").insert({
      user_id: userId,
      animal_id: id,
      result: isCorrect,
    });

    if (error) {
      console.error("保存エラー:", error);
      // エラーが出ても、結果ページには遷移する
    }

    const resultQuery = isCorrect
      ? `/quiz/result?id=${id}&correct=true`
      : `/quiz/result?id=${id}&correct=false`;
    router.push(resultQuery);
  };

  return (
    <div>
      <div className="flex w-auto justify-center m-2">
        <div className="border-4 border-black rounded-2xl bg-yellow text-center h-10 w-28">
          {output ? (
            <div className="text-xl text-black font-black ">
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
              className="border-4 border-black rounded-2xl bg-skyblue text-center h-10 w-28 mx-1"
              onClick={handleCancelClick}
            >
              やりなおす
            </button>
            <button
              onClick={handleClickResult}
              className="border-4 border-black rounded-2xl bg-orange text-center h-10 w-28 mx-1"
            >
              けってい
            </button>
          </div>
        ) : (
          <div>
            <Button onClick={handleMicClick}>
              {isListening ? <SquareStop /> : <Mic />}
            </Button>
            <input
              type="text"
              className="border-2 border-black bg-orange mr-2 rounded p-2 w-48 mb-4 text-black"
              placeholder="(ひらがな)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="bg-orange rounded-3xl w-28 px-2.5 border-4 border-black p-1.5 hover:bg-yellow font-black"
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
