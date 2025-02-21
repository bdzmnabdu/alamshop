<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useProductsByKeyword from "@/composables/useProductsByKeyword";
import ProductCard from "@/components/common/ProductCard.vue";
import ProductCardLoad from "@/components/common/ProductCardLoad.vue";
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
import { Button } from "@/components/ui/button";

const router = useRouter();
const route = useRoute();
const keyword = ref(decodeURIComponent(route.query.keyword as string) || "");
const currentPage = ref(1);

const { isLoading, isError, product, refetch } = useProductsByKeyword(
  keyword,
  currentPage
);

const fetchSearchResults = () => {
  if (keyword.value) {
    router.push({
      path: "/search",
      query: { keyword: encodeURIComponent(keyword.value) },
    });
  }
};

const currentPageFn = (page: number) => {
  currentPage.value = page;
  console.log(currentPage.value);
};

watch(
  () => route.query.keyword,
  (newQuery) => {
    keyword.value = decodeURIComponent(newQuery as string);
    refetch();
  },
  { immediate: true }
);

onMounted(() => {
  fetchSearchResults();
});
</script>
<template>
  <section class="mb-9 mx-2 md:mx-32 flex-1">
    <div class="min-h-screen py-5 md:py-12">
      <div class="mx-auto w-full rounded-lg md:py-8">
        <div class="text-center mb-6">
          <h1 class="text-xl font-bold text-gray-800">Search Results</h1>
          <p class="text-gray-500 mt-2">
            Search for:
            <span class="font-semibold text-blue-500">{{ keyword }}</span>
          </p>
        </div>
        <div class="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
          <ProductCardLoad v-if="isLoading" v-for="n in 10" :key="n" />
          <ProductCard
            v-if="!isLoading && product && product.itemsprd.length > 0"
            v-for="prd in product.itemsprd"
            :key="prd.product_id"
            :product="prd"
          />
        </div>
        <div
          v-if="
            !isLoading &&
            !isError &&
            (!product || product.itemsprd.length === 0)
          "
          class="flex flex-col justify-center items-center text-center mt-8 text-gray-500"
        >
          <img
            src="@/assets/images/empty-draw.png"
            style="height: 150px; width: 200px"
            class="mb-3"
          />
          <p>No results found for "{{ keyword }}".</p>
        </div>
      </div>
      <div
        v-if="product && product.itemsprd.length > 0"
        id="pagination"
        class="w-full mt-6"
      >
        <Pagination
          v-slot="{ page }"
          :total="product?.total"
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
  </section>
</template>
