import { useQuery } from "@tanstack/vue-query";
import { getCity } from "@/api";

const useCities = () => {
  const { data } = useQuery({
    queryKey: ["cities"],
    queryFn: () => getCity(),
    refetchOnWindowFocus: false,
  });

  return {
    cities: data,
  };
};

export default useCities;
