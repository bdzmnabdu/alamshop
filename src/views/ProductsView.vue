<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ProductList from "@/components/layout/ProductList.vue";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";

const router = useRouter();
const route = useRoute();
// const defaultValue = "item-1";

const accordionItems = [
  {
    value: "categories",
    title: "Categories",
    options: [
      { optName: "Ornamental Fish", optVal: "live" },
      { optName: "Consumption Fish", optVal: "faf" },
      { optName: "Sea Food", optVal: "lff" },
      { optName: "Fry Fish", optVal: "fry" },
    ],
  },
  {
    value: "water-type",
    title: "Water Type",
    options: [
      { optName: "Freshwater", optVal: "freshwater" },
      { optName: "Saltwater", optVal: "saltwater" },
    ],
  },
];

// Variabel filter yang dipilih
const selectedCategory = ref<string | undefined>(undefined);
// console.log(selectedCategory.value);
const selectedWaterType = ref<string[]>([]);

const handleWaterTypeChange = (waterType: string) => {
  if (selectedWaterType.value.includes(waterType)) {
    selectedWaterType.value = selectedWaterType.value.filter(
      (item) => item !== waterType
    );
  } else {
    selectedWaterType.value.push(waterType);
  }
};

const updateURL = () => {
  if (!selectedCategory.value) return;

  const params = new URLSearchParams();
  if (selectedWaterType.value.length > 0) {
    selectedWaterType.value.forEach((type) => {
      params.append("water-type", type);
    });
  }

  const categoryValue = accordionItems[0].options.find(
    (cat) => cat.optVal === selectedCategory.value
  )?.optVal;
  // const categoryValue = accordionItems[0].options.find(
  //   (cat) => cat.optName === selectedCategory.value
  // )?.optVal;

  if (!categoryValue) return;

  router.push({
    path: `/products/fishery/${categoryValue}`,
    query: {
      waterType:
        selectedWaterType.value.length > 0
          ? selectedWaterType.value
          : undefined,
    },
  });
};

watch([selectedCategory, selectedWaterType], updateURL, { deep: true });

onMounted(() => {
  selectedCategory.value = (route.params.catId as string) || undefined;
  const waterTypeQuery = route.query.waterType as string | string[];
  selectedWaterType.value = Array.isArray(waterTypeQuery)
    ? waterTypeQuery
    : waterTypeQuery
    ? [waterTypeQuery]
    : [];
});
</script>
<template>
  <section class="h-[600px] mb-9 mx-2 md:mx-32 flex-1">
    <RouterLink
      :to="{ path: '/' }"
      class="flex items-center gap-3 cursor-pointer mt-5 w-fit"
    >
      <span class="pi pi-arrow-left text-xs"></span>
      <p class="text-sm hover:underline">Back</p>
    </RouterLink>

    <!-- Main Content -->
    <div class="grid grid-cols-1 md:flex gap-5 mt-5 w-full">
      <!-- Filter Sidebar -->
      <div
        id="filter"
        class="border border-neutral-200 rounded-xl h-fit p-4 flex flex-col justify-between md:w-1/5 md:sticky md:top-20"
      >
        <div id="acc">
          <Accordion type="multiple" class="w-full" collapsible>
            <!-- Kategori (Radio Group) -->
            <AccordionItem value="categories">
              <AccordionTrigger class="text-sm">Categories</AccordionTrigger>
              <AccordionContent>
                <RadioGroup v-model="selectedCategory">
                  <div
                    v-for="(opt, index) in accordionItems[0].options"
                    :key="index"
                    class="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      :id="`category-${index}`"
                      :value="opt.optVal"
                    />
                    <Label :for="`category-${index}`">{{ opt.optName }}</Label>
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            <!-- Water Type (Checkbox) -->
            <AccordionItem value="water-type">
              <AccordionTrigger class="text-sm">Water Type</AccordionTrigger>
              <AccordionContent
                v-for="(opt, index) in accordionItems[1].options"
                :key="index"
              >
                <div class="flex items-center space-x-2">
                  <Checkbox
                    :id="`waterType-${index}`"
                    :checked="selectedWaterType.includes(opt.optVal)"
                    @update:checked="() => handleWaterTypeChange(opt.optVal)"
                  />
                  <Label :for="`waterType-${index}`">{{ opt.optName }}</Label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div id="allprd" class="md:w-4/5">
        <h1 class="font-semibold">Our Products</h1>
        <ProductList />
      </div>
    </div>
  </section>
</template>
