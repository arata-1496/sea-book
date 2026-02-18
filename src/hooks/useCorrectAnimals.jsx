"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import useUserStore from "@/store/userStore";

function useCorrectAnimals() {
  const [correctAnimals, setCorrectAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storeUserId = useUserStore((state) => state.userId);

  useEffect(() => {
    const fetchCorrectAnimals = async () => {
      const { data, error } = await supabase
        .from("animal_answers")
        .select("animal_id")
        .eq("user_id", storeUserId)
        .eq("result", true);

      if (error) {
        console.error("エラー", error);
        setError(error);
      } else {
        setCorrectAnimals(data);
      }

      setLoading(false);
    };

    fetchCorrectAnimals();
  }, [storeUserId]);

  return { correctAnimals, loading, error };
}
export default useCorrectAnimals;
