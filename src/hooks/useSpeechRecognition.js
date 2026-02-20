"use client"

import { useState,useRef } from "react";


export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [hasKanji, setHasKanji] = useState(false)
  const timerId = useRef(null)

//ーーーweb speech API設定（デフォルト）ーーーーー
  //初期化
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  //言語設定を日本語に
  recognition.lang = 'ja-JP';
  //解析中の結果を表示する
  recognition.interimResults = true;
  //認識のたびに継続的に結果を返す
  recognition.continuous = true;
  //結果を受け取る
  recognition.onresult = (event)=>{
    const text = event.results[0][0].transcript;
    setTranscript(text)
    setIsListening(false)
    clearTimeout(timerId.current)
    const Kanji = /[^\u3040-\u30FF]/.test(text);
    if(Kanji){
      setHasKanji(true)
    }
  };
  //エラー時
  recognition.onerror = () => {
    setIsListening(false)
  }

  const handleMicClick= () =>{
    setIsListening(true)
    //音声認識開始
    recognition.start();
    //タイマースタート
    timerId.current = setTimeout(()=>{
      recognition.stop()
      setIsListening(false)
    },3000)
  }

  return { isListening,transcript, handleMicClick, hasKanji};
}

