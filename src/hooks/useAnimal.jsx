import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function useAnimal(id) {
  // ← 何を受け取る？
  const [animal, setAnimal] = useState({}); // ← 初期値は？
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimal() {
      const { data, error } = await supabase
        .from("animals")
        .select("*") // ← 何を取得？
        .eq("animal_id", id) // ← どの行？
        .single(); // ← 1件だけ取得（重要！）

      if (error) {
        console.error("エラー", error);
        setError(error);
      } else {
        setAnimal(data); // ← 何をセット？
      }

      setLoading(false);
    }

    fetchAnimal();
  }, [id]); // ← 依存配列に何を入れる？

  return { animal, loading, error }; // ← 何を返す？
}

export default useAnimal;
