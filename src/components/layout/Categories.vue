<script setup lang="ts">
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RouterLink } from "vue-router";
// import { Button } from "@/components/ui/button";
import { FishSymbol } from "lucide-vue-next";

const listcat = [
  {
    id: 1,
    catname: "Ornamental Freshwater Fish",
    link: "products/fishery/aof",
  },
  {
    id: 2,
    catname: "Ornamental Saltwater Fish",
    link: "products/fishery/aos",
  },
  { id: 3, catname: "Consumption Fish", link: "products/fishery/ac" },
  { id: 4, catname: "Sea Food", link: "products/fishery/ak" },
  { id: 5, catname: "Fry Fish", link: "products/fishery/aff" },
];
</script>
<template>
  <section class="mt-3">
    <ScrollArea class="whitespace-wrap">
      <div
        id="cat-container"
        class="grid grid-cols-2 md:grid-cols-5 gap-3 md:w-full"
      >
        <div v-for="cat in listcat" :key="cat.id">
          <RouterLink :to="cat.link">
            <span
              variant="outline"
              class="relative border-1 rounded-xl p-3 flex justify-center items-center cursor-pointer w-full h-16 md:h-full bg-white hover:bg-orange-100 overflow-hidden"
            >
              <p class="text-center text-sm md:text-base z-10">
                {{ cat.catname }}
              </p>
              <FishSymbol
                class="absolute -right-5 top-1 text-orange-500 opacity-15"
                :size="100"
              />
            </span>
          </RouterLink>
        </div>
      </div>
      <ScrollBar orientation="horizontal" class="hidden" />
    </ScrollArea>
  </section>
</template>
