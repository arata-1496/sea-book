"use client";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const bgRef = useRef(null);
  const containerRef = useRef(null);
  const [gyroEnabled, setGyroEnabled] = useState(false);

  // ── PC：マウス移動 ──
  const handleMouseMove = (e) => {
    const container = containerRef.current;
    const bg = bgRef.current;
    if (!container || !bg) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 70;
    const y = ((e.clientY - top) / height - 0.5) * 70;

    bg.style.transform = `translate(${x}px, ${y}px) scale(1.25)`;
  };

  const handleMouseLeave = () => {
    const bg = bgRef.current;
    if (!bg) return;
    bg.style.transform = `translate(0px, 0px) scale(1.25)`;
  };

  // ── スマホ：画面タッチで初回ジャイロ許可リクエスト ──
  const enableGyro = () => {
    if (gyroEnabled) return;

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+ は .then() で書かないとユーザー操作のコンテキストが失われる
      DeviceOrientationEvent.requestPermission()
        .then((permission) => {
          if (permission === "granted") setGyroEnabled(true);
        })
        .catch((e) => console.log("ジャイロ許可拒否:", e));
    } else {
      // Android はそのまま有効化
      setGyroEnabled(true);
    }
  };

  // ── ジャイロが有効になったらイベントリスナーを登録 ──
  useEffect(() => {
    if (!gyroEnabled) return;

    const handleOrientation = (e) => {
      const bg = bgRef.current;
      if (!bg) return;

      // gamma: 左右の傾き（-90〜90）
      // beta:  前後の傾き（-180〜180）、自然な持ち方は約45°なので補正
      const x = (e.gamma / 90) * 70;
      const y = ((e.beta - 45) / 90) * 70;

      bg.style.transform = `translate(${x}px, ${y}px) scale(1.25)`;
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [gyroEnabled]);

  return (
    <div className="flex flex-col h-full bg-blue">
      <div
        ref={containerRef}
        className="flex-1 relative rounded-3xl mx-3 my-3 border-4 border-black overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={enableGyro}
      >
        {/* 背景画像 */}
        <div
          ref={bgRef}
          className="absolute inset-0 transition-transform duration-150 ease-out"
          style={{
            backgroundImage: "url('/visual/bg-top.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.25)",
          }}
        />

        {/* ── ジャイロ有効インジケーター（デバッグ用） ── */}
        {gyroEnabled && (
          <div className="absolute top-3 left-3 z-20 bg-green-400 border-2 border-black rounded-full px-2 py-1">
            <span className="text-xs font-black text-black">ジャイロON</span>
          </div>
        )}

        {/* ── うみの 吹き出し ── */}
        <div className="absolute top-[23%] left-[28%] z-10">
          <div className="relative bg-amber-50 border-4 border-black rounded-2xl px-4 py-2">
            <span className="text-black font-black text-xl sm:text-2xl">うみの</span>
            <div
              className="absolute -bottom-[18px] left-4 border-[10px] border-transparent"
              style={{ borderTopColor: "black" }}
            />
            <div
              className="absolute -bottom-[11px] left-[18px] border-[7px] border-transparent"
              style={{ borderTopColor: "#fffbeb" }}
            />
          </div>
        </div>

        {/* ── いきものずかん タイトル ── */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-10 w-full text-center px-4">
          <h1
            className="text-white font-black text-4xl sm:text-5xl leading-tight"
            style={{ textShadow: "3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000" }}
          >
            いきものずかん
          </h1>
        </div>

        {/* ── はじめる ボタン ── */}
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-20">
          <Link href="/user">
            <button className="bg-orange-400 border-4 border-black rounded-full px-10 py-3 text-white font-black text-2xl sm:text-3xl shadow-[3px_3px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all whitespace-nowrap">
              はじめる
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
