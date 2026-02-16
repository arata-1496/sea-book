"use client";

import useAnimal from "@/hooks/useAnimal";

export default function TestPage() {
  const { animal, loading, error } = useAnimal(1);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Supabase接続テスト</h1>
      <h2>生き物一覧</h2>

      <div className="flex gap-2">
        <div key={animal.animal_id}>
          <img className="w-auto h-60" src={animal.image} alt={animal.name} />
          <h2 className="text-center">{animal.name}</h2>
        </div>
      </div>
    </div>
  );
}
