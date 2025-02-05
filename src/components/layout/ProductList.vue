<script setup lang="ts">
import { ref, computed } from "vue";
import ProductCard from "@/components/common/ProductCard.vue";
import ProductCardLoad from "@/components/common/ProductCardLoad.vue";
import useProducts from "@/composables/useProducts";
import { Button } from "@/components/ui/button";
import { useRoute } from "vue-router";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
// import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

const route = useRoute();

const currentPage = ref(1);
const catId = computed(() => route.params.catId as string | undefined);
console.log(catId.value);
const waterType = computed(() => {
  const queryValue = route.query.waterType as string | string[];
  return Array.isArray(queryValue)
    ? queryValue
    : queryValue
    ? [queryValue]
    : [];
});

const { isLoading, isError, products } = useProducts(
  currentPage,
  catId,
  waterType
);

const cols = computed(() =>
  catId.value ? "md:grid-cols-4" : "md:grid-cols-5"
);
console.log(cols.value);

const currentPageFn = (page: number) => {
  currentPage.value = page;
  console.log(currentPage.value);
};
</script>
<template>
  <div v-if="products && products?.itemsprd.length > 0">
    <section
      :class="`mt-3 grid grid-cols-2 ${cols} gap-2 md:gap-4 flex-1 w-full`"
    >
      <ProductCardLoad v-if="isLoading" v-for="n in 20" :key="n" />
      <ProductCard
        v-else
        v-for="dt in products.itemsprd"
        :key="dt.product_id"
        :product="dt"
      />
    </section>
    <div id="pagination" class="w-full mt-6">
      <Pagination
        v-slot="{ page }"
        :total="products?.total"
        :sibling-count="1"
        v-model:page="currentPage"
        :itemsPerPage="20"
      >
        <PaginationList
          v-slot="{ items }"
          class="flex items-center justify-center md:justify-end gap-1"
        >
          <PaginationFirst class="rounded-2xl" />
          <PaginationPrev class="rounded-2xl" />

          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="w-10 h-10 p-0 rounded-2xl"
                :variant="item.value === page ? 'default' : 'outline'"
                @click="currentPageFn(item.value)"
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext class="rounded-2xl" />
          <PaginationLast class="rounded-2xl" />
        </PaginationList>
      </Pagination>
    </div>
  </div>
  <secion
    v-if="
      !isLoading && !isError && (!products || products.itemsprd.length === 0)
    "
    class="text-center flex flex-col justify-center items-center mb-9 mx-2 md:mx-32 flex-1 p-20"
  >
    <!-- <DotLottieVue
      style="height: 200px; width: 200px"
      autoplay
      loop
      src="https://lottie.host/7c1ce286-9d9e-40ce-93b7-0a2e06dfd912/Qpx5pDtsXP.lottie"
    /> -->
    <img
      src="@/assets/images/empty-draw.png"
      style="height: 150px; width: 200px"
      class="mb-3"
    />
    <p class="text-base font-medium text-slate-600">No products found</p>
  </secion>
</template>
