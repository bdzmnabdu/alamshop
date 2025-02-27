import { useQuery } from "@tanstack/vue-query";
import { getnowa } from "@/api";

const useNoWA = () => {
  const { data } = useQuery({
    queryKey: ["nowa"],
    queryFn: () => getnowa(),
    refetchOnWindowFocus: false,
  });

  return {
    nowa: data,
  };
};

export default useNoWA;
