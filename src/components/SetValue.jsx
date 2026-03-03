"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import useUserStore from "@/store/userStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Mic, SquareStop } from "lucide-react";

export const SetValue = ({ animal, id }) => {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const userId = useUserStore((state) => state.userId);
  const router = useRouter();
  const { isListening, transcript, handleMicClick, convertToHiragana } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript !== "") {
      setOutput(transcript);
    }
  }, [transcript]);

  const handleClick = () => {
    if (inputValue === null) return;
    setOutput(inputValue);
    setInputValue("");
  };

  const handleCancelClick = () => {
    setOutput("");
  };

  const handleClickResult = async () => {
    const hiraganaOutput = await convertToHiragana(output);
    const isCorrect = animal.name === output || animal.name === hiraganaOutput;

    const { error } = await supabase.from("animal_answers").insert({
      user_id: userId,
      animal_id: id,
      result: isCorrect,
    });

    if (error) {
      console.error("保存エラー:", error);
    }

    const resultQuery = isCorrect
      ? `/quiz/result?id=${id}&correct=true`
      : `/quiz/result?id=${id}&correct=false`;
    router.push(resultQuery);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 回答表示エリア */}
      <div className="flex justify-center">
        <div className="bg-amber-50 border-4 border-black rounded-2xl px-6 py-2 min-w-36 text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          {output ? (
            <p className="text-xl text-black font-black">{output}</p>
          ) : (
            <p className="text-xl text-gray-400 font-black">
              {inputValue || "？？？"}
            </p>
          )}
        </div>
      </div>

      {/* 操作ボタンエリア */}
      {output ? (
        /* 回答後：やりなおす・けってい */
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCancelClick}
            className="flex-1 max-w-36 bg-teal-400 border-4 border-black rounded-full py-2.5 text-white font-black text-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            やりなおす
          </button>
          <button
            onClick={handleClickResult}
            className="flex-1 max-w-36 bg-orange-400 border-4 border-black rounded-full py-2.5 text-white font-black text-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            けってい
          </button>
        </div>
      ) : (
        /* 回答前：マイク・テキスト入力・きめた */
        <div className="flex flex-col gap-3">
          {/* マイクボタン */}
          <div className="flex justify-center">
            <button
              onClick={handleMicClick}
              className={`w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all ${
                isListening ? "bg-red-400" : "bg-orange-400"
              }`}
            >
              {isListening ? (
                <SquareStop className="text-white w-7 h-7" />
              ) : (
                <Mic className="text-white w-7 h-7" />
              )}
            </button>
          </div>

          {/* テキスト入力＋きめた */}
          <div className="flex gap-2 justify-center">
            <input
              type="text"
              className="min-w-0 flex-1 max-w-48 bg-amber-50 border-4 border-black rounded-full px-4 py-2 text-black font-bold text-sm focus:outline-none focus:border-blue-400"
              placeholder="ひらがなでいれてね"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              onClick={handleClick}
              className="bg-orange-400 border-4 border-black rounded-full px-4 py-2 text-white font-black text-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              きめた
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
