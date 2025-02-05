import { useQuery } from "@tanstack/vue-query";
import { trackOrder } from "@/api";
import { watch, ref, type Ref } from "vue";

const useTrackOrder = (ordernum: Ref<string>) => {
  const currentOrder = ref(ordernum.value);
  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ["ordernum", currentOrder],
    queryFn: () => trackOrder(currentOrder.value),
    refetchOnWindowFocus: false,
    enabled: !!currentOrder.value, // Pastikan query tidak dijalankan tanpa ordernum
  });

  // Observasi perubahan pada ordernum dan perbarui currentOrder
  watch(ordernum, (newVal) => {
    currentOrder.value = newVal;
    refetch(); // Refetch data secara manual ketika ordernum berubah
  });

  return { isLoading, isError, error, data, refetch };
};

export default useTrackOrder;
