import { useQuery } from "@tanstack/vue-query";
import { getProductLogistic } from "@/api";

const useProductsLogistic = () => {
  const { data } = useQuery({
    queryKey: ["productsLogistic"],
    queryFn: () => getProductLogistic(),
    refetchOnWindowFocus: false,
  });

  return {
    productsLogistic: data,
  };
};

export default useProductsLogistic;
