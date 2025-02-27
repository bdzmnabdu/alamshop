<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ProductList from "@/components/layout/ProductList.vue";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";

const router = useRouter();
const route = useRoute();

const accordionItems = [
  {
    value: "categories",
    title: "Categories",
    options: [
      { optName: "Ornamental Freshwater Fish", optVal: "aof" },
      { optName: "Ornamental Saltwater Fish", optVal: "aos" },
      { optName: "Consumption Fish", optVal: "ac" },
      { optName: "Sea Food", optVal: "ak" },
      { optName: "Fry Fish", optVal: "aff" },
    ],
  },
];

const selectedCategory = ref<string | undefined>(undefined);

const updateURL = () => {
  if (!selectedCategory.value) return;

  const categoryValue = accordionItems[0].options.find(
    (cat) => cat.optVal === selectedCategory.value
  )?.optVal;

  if (!categoryValue) return;

  router.push({
    path: `/products/fishery/${categoryValue}`,
  });
};

watch([selectedCategory], updateURL, { deep: true });

onMounted(() => {
  selectedCategory.value = (route.params.catId as string) || undefined;
});
</script>
<template>
  <section class="h-[600px] mb-9 mx-2 md:mx-32 flex-1">
    <RouterLink
      :to="{ path: '/' }"
      class="flex items-center gap-3 cursor-pointer mt-5 w-fit bg-orange-100 py-2 px-3 rounded-xl"
    >
      <span class="pi pi-arrow-left text-xs text-orange-900"></span>
      <p class="text-sm hover:underline text-orange-900">Back</p>
    </RouterLink>

    <!-- Main Content -->
    <div class="grid grid-cols-1 md:flex gap-5 mt-5 w-full">
      <!-- Filter Sidebar -->
      <div
        id="filter"
        class="border border-neutral-200 rounded-2xl h-fit p-4 flex flex-col justify-between md:w-1/5 md:sticky md:top-20"
      >
        <div id="acc">
          <div class="w-full">
            <div>
              <h3 class="text-base font-medium mb-3">Categories</h3>
              <div>
                <RadioGroup v-model="selectedCategory">
                  <div
                    v-for="(opt, index) in accordionItems[0].options"
                    :key="index"
                    class="flex items-start space-x-2 my-1"
                  >
                    <RadioGroupItem
                      :id="`category-${index}`"
                      :value="opt.optVal"
                    />
                    <Label
                      :for="`category-${index}`"
                      class="leading-4 font-normal"
                      >{{ opt.optName }}</Label
                    >
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="allprd" class="md:w-4/5">
        <h1 class="font-semibold">Our Products</h1>
        <ProductList />
      </div>
    </div>
  </section>
</template>
