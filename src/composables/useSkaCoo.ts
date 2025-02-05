import { useQuery } from "@tanstack/vue-query";
import { getSKACOO } from "@/api";

const useSkaCoo = () => {
  const { data } = useQuery({
    queryKey: ["govreg"],
    queryFn: () => getSKACOO(),
    refetchOnWindowFocus: false,
  });

  return {
    govreg: data,
  };
};

export default useSkaCoo;
