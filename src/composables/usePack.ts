import { useQuery } from "@tanstack/vue-query";
import { getPack } from "@/api";

const usePack = () => {
  const { data } = useQuery({
    queryKey: ["pack"],
    queryFn: () => getPack(),
    refetchOnWindowFocus: false,
  });

  return {
    pack: data,
  };
};

export default usePack;
