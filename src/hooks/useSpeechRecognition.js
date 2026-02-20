"use client"

import { useState,useRef, useEffect } from "react";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";



export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const timerId = useRef(null)
  const kuroshiroRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(()=>{
    //ーーーweb speech API設定（デフォルト）ーーーーー
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'ja-JP';
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;
    //結果を受け取る
    recognitionRef.current.onresult =async(event)=>{
      const text = event.results[0][0].transcript;
      const result = await kuroshiroRef.current.convert(text, { to: "hiragana" });
      setTranscript(result)
      setIsListening(false)
      clearTimeout(timerId.current)
    };
    //エラー時
    recognitionRef.current.onerror = (event) => {
      console.log("エラー:", event.error)
      setIsListening(false)
    }
    // Kuroshiro用初期化[設定]（一度だけ）
    const init = async()=>{
      const kuroshiro = new Kuroshiro();
      await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict" }));
      kuroshiroRef.current = kuroshiro
    }
    init()
  },[])

//ーーーひらがな変換ーーーーーーーーーーーー
  const convertToHiragana = async (text) => {
    if (!kuroshiroRef.current) return text;
    const converted = await kuroshiroRef.current.convert(text, { to: "hiragana" });
    const katakanaToHiragana = (str) => {
      return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
      );
    };
    return katakanaToHiragana(converted);
  };//ーーーーーーーーーーーーーーーーーーー



  const handleMicClick= () =>{
    console.log("isListening:", isListening)
    if (isListening){
      clearTimeout(timerId.current)
      recognitionRef.current.stop()
      setIsListening(false)
      return;
    }
    setIsListening(true)
    //音声認識開始
    recognitionRef.current.start();
    //タイマースタート
    timerId.current = setTimeout(()=>{
      recognitionRef.current.stop()
      setIsListening(false)
    },3000)
  }

  return { isListening,transcript, handleMicClick, convertToHiragana };
}

