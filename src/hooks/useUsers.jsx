import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimals() {
      const { data, error } = await supabase.from("user").select("user_id");

      if (error) {
        console.error("エラー", error);
        setError(error);
      } else {
        setUsers(data);
      }

      setLoading(false);
    }

    fetchAnimals();
  }, []);

  return { animals, loading, error };
}

export default useUsers;
