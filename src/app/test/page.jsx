"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import React from "react";

export default function TestPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from("animals").select("*");

      if (error) {
        console.error("エラー:", error);
      } else {
        setAnimals(data);
      }
      setLoading(false);
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Supabase接続テスト</h1>
      <h2>生き物一覧</h2>
      {animals.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <div className="flex gap-2">
          {animals.map((animal) => (
            <div key={animal.animal_id}>
              <img
                className="w-auto h-60"
                src={animal.image_rare}
                alt={animal.name}
              />
              <h2 className="text-center">{animal.name}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
