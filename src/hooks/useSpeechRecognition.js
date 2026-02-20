"use client"

import { useState,useRef, useEffect } from "react";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";



export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const timerId = useRef(null)
  const kuroshiroRef = useRef(null)

  useEffect(()=>{
    const init = async()=>{
      // 初期化（一度だけ）
      const kuroshiro = new Kuroshiro();
      await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict" }));
      kuroshiroRef.current = kuroshiro
    }
    init()
  },[])

  const convertToHiragana = async (text) => {
    if (!kuroshiroRef.current) return text;
    const converted = await kuroshiroRef.current.convert(text, { to: "hiragana" });
    const katakanaToHiragana = (str) => {
      return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
      );
    };
    return katakanaToHiragana(converted);
  };

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
  recognition.onresult =async(event)=>{
    const text = event.results[0][0].transcript;
    const result = await kuroshiroRef.current.convert(text, { to: "hiragana" });
    setTranscript(result)
    setIsListening(false)
    clearTimeout(timerId.current)
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

  return { isListening,transcript, handleMicClick, convertToHiragana };
}

