import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function useAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimals() {
      const { data, error } = await supabase
        .from("animals")
        .select("animal_id");

      if (error) {
        console.error("エラー", error);
        setError(error);
      } else {
        setAnimals(data);
      }

      setLoading(false);
    }

    fetchAnimals();
  }, []);

  return { animals, loading, error };
}

export default useAnimals;
