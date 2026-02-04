import Link from "next/link";

export default function Home() {
  return (
    <div >
      <h1>Hello World!</h1>
      <h1 className="font-black text-[40px] text-yellow outline-solid outline-1">こんにちは</h1>
      <button>
        <Link href="/quiz-start">クイズ開始</Link>
      </button>

    </div>
  );
}
// /* いきものずかん */

// position: absolute;
// width: 280px;
// height: 48px;
// left: 33px;
// top: 154px;

// font-family: 'Noto Sans JP';
// font-style: normal;
// font-weight: 900;
// font-size: 40px;
// line-height: 48px;
// /* ボックスの高さと同一 */

// color: #F5F1DC;

// border: 1px solid #010101;

