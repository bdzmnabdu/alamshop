<script setup lang="ts">
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";

const listcat = [
  { id: 1, catname: "Ornamental Fish", link: "products/fishery/live" },
  { id: 2, catname: "Sea Food", link: "products/fishery/lff" },
  { id: 3, catname: "Fry Fish", link: "products/fishery/fry" },
  { id: 4, catname: "Consumption Fish", link: "products/fishery/faf" },
];
</script>
<template>
  <section class="mt-3">
    <ScrollArea class="whitespace-nowrap">
      <div id="cat-container" class="flex items-center gap-3 md:w-[700px]">
        <div v-for="cat in listcat" :key="cat.id">
          <RouterLink :to="cat.link">
            <Button
              variant="outline"
              class="border rounded-md p-3 flex justify-center items-center cursor-pointer"
            >
              <p class="text-center">{{ cat.catname }}</p>
            </Button>
          </RouterLink>
        </div>
      </div>
      <ScrollBar orientation="horizontal" class="hidden" />
    </ScrollArea>
  </section>
</template>
