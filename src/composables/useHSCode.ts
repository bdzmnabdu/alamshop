import { useQuery } from "@tanstack/vue-query";
import { getHSCode } from "@/api";
import { Ref } from "vue";

const useHSCode = (hsc?: Ref<string>) => {
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["hSCode"],
    queryFn: () => getHSCode(hsc?.value),
    refetchOnWindowFocus: false,
  });

  return {
    isLoading: isFetching,
    isError,
    hscodes: data,
    error,
    refetch,
  };
};

export default useHSCode;
