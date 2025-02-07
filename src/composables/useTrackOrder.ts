import { useQuery } from "@tanstack/vue-query";
import { trackOrder } from "@/api";
import { watch, ref, type Ref } from "vue";

const useTrackOrder = (ordernum: Ref<string>) => {
  const currentOrder = ref(ordernum.value);
  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ["ordernum", currentOrder],
    queryFn: () => trackOrder(currentOrder.value),
    refetchOnWindowFocus: false,
    enabled: !!currentOrder.value,
  });

  watch(ordernum, (newVal) => {
    currentOrder.value = newVal;
    refetch();
  });

  return { isLoading, isError, error, data, refetch };
};

export default useTrackOrder;
