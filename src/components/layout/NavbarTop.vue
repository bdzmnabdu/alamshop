<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store";
import { onMounted, ref } from "vue";
import Cart from "../common/Cart.vue";

const router = useRouter();
const query = ref<string>("");

const sideSheet = ref<"bottom" | "right">("bottom");
onMounted(() => {
  if (window.innerWidth > 520) {
    sideSheet.value = "right";
  } else {
    sideSheet.value = "bottom";
  }
});

const cartStore = useCartStore();

const handleSearch = () => {
  // console.log(query.value);
  if (query.value) {
    router.push({
      path: "/search",
      query: { keyword: encodeURIComponent(query.value) },
    });
  }
};
</script>
<template>
  <header class="sticky top-0 z-50">
    <nav
      class="bg-white px-2 md:px-10 py-2 grid grid-cols-[auto_auto_auto] md:grid-cols-[2fr_1fr_auto_auto] items-center gap-2"
    >
      <RouterLink to="/" class="order-1">
        <div id="logo" class="flex items-center gap-1">
          <img
            src="/images/alams-logo.png"
            alt="alams-logo"
            class="w-10 h-10"
          />
          <h3 class="font-semibold text-primary">AlamShop</h3>
        </div>
      </RouterLink>
      <div
        class="relative w-ful order-4 md:order-2 flex items-center col-span-3 md:col-auto"
      >
        <Input
          id="search"
          type="search"
          placeholder="Search..."
          class="pl-8 h-9 w-full"
          @keyup.enter="handleSearch"
          v-model="query"
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-2 text-slate-500"
        >
          <i class="pi pi-search" style="font-size: 0.9rem"></i>
        </span>
        <button
          v-if="query"
          @click="query = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✖
        </button>
      </div>
      <div
        id="cart"
        class="order-3 grid grid-cols-[auto_auto] items-center justify-self-end"
      >
        <Cart :sideSheet="sideSheet" :cartStore="cartStore">
          <template #navcart>
            <div class="relative p-3 leading-3 cursor-pointer">
              <i class="pi pi-shopping-cart" style="font-size: 1.2rem"></i>
              <div class="absolute top-0 right-0">
                <Badge class="text-xs h-3 p-2">{{ cartStore.itemCount }}</Badge>
              </div>
            </div>
          </template>
        </Cart>
      </div>

      <div
        id="track"
        class="order-3 md:order-4 grid grid-cols-[auto_auto] items-center justify-self-end"
      >
        <!-- <TrackOrderButton /> -->
        <RouterLink to="/track-order">
          <Button variant="outline" class="h-full">
            <i class="pi pi-truck" style="font-size: 1.2rem"></i>
            Track Order
          </Button>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
<style lang="css" scoped>
input[type="search"]::-webkit-search-cancel-button {
  appearance: none;
}
</style>
