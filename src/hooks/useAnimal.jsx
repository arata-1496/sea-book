import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function useAnimal(id) {
  const [animal, setAnimal] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimal() {
      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .eq("animal_id", id)
        .single();

      if (error) {
        console.error("エラー", error);
        setError(error);
      } else {
        setAnimal(data);
      }

      setLoading(false);
    }

    fetchAnimal();
  }, [id]);

  return { animal, loading, error };
}

export default useAnimal;
