import { useQuery } from "@tanstack/vue-query";
import { getProductsByKeyword } from "@/api";
import { ref, watch, type Ref } from "vue";

const useProductsByKeyword = (
  keyword: Ref<string>,
  currentPage: Ref<number>
) => {
  console.log(currentPage.value);
  const currKeyword = ref(keyword.value);
  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ["keyword", currKeyword.value, currentPage],
    queryFn: () => getProductsByKeyword(currKeyword.value, currentPage.value),
    refetchOnWindowFocus: false,
    enabled: !!currKeyword.value,
  });

  watch(keyword, (newVal) => {
    currKeyword.value = newVal;
    refetch();
  });

  return {
    isLoading,
    isError,
    error,
    product: data,
    refetch,
  };
};

export default useProductsByKeyword;
