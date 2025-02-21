import { useQuery, keepPreviousData } from "@tanstack/vue-query";
import { getAllProducts } from "@/api";
import type { ComputedRef, Ref } from "vue";

const useProducts = (
  currentPage: Ref<number>,
  catId?: ComputedRef<string | undefined>,
  waterType?: Ref<string | string[] | undefined>
) => {
  const { isFetching, isError, data, error } = useQuery({
    queryKey: ["products", currentPage, "catid", catId, "waterType", waterType],
    queryFn: () =>
      getAllProducts(currentPage.value, catId?.value, waterType?.value),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
  return {
    isLoading: isFetching,
    isError,
    products: data,
    error,
  };
};

export default useProducts;
