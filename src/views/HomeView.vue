<script setup lang="ts">
import Categories from "@/components/layout/Categories.vue";
import ProductList from "@/components/layout/ProductList.vue";
import { onMounted, ref } from "vue";
import { TokenService } from "@/services/TokenService";

const isLoading = ref(true);

const generateToken = () => {
  TokenService.generateToken();
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>
<template>
  <section class="h-[600px] mb-9 mx-2 md:mx-32 flex-1">
    <section id="banner-log">
      <h1 class="mt-5 mb-3 font-semibold">Alam Logistic</h1>
      <div
        v-if="isLoading"
        class="animate-pulse w-full h-[100px] md:h-[200px] bg-slate-200 rounded-xl"
      ></div>
      <div v-else class="relative w-full">
        <img
          src="@/assets/images/pln4-04.jpg"
          alt="banner"
          class="w-full object-cover border-2 rounded-xl border-neutral-100"
        />
        <div
          class="absolute top-3 left-3 md:top-20 md:left-20 h-[60%] md:h-[100%] w-[60%] md:w-[40%]"
        >
          <h1 class="font-bold text-sm md:text-2xl mb-3 md:mb-12">
            You Order, We Deliver, Safely to Your Destination!
          </h1>
          <a
            href="/logistics"
            class="bg-orange-500 hover:bg-orange-300 text-white text-xs md:text-sm py-2 px-3 rounded-full"
            @click="generateToken"
            >Start Sending</a
          >
        </div>
      </div>
    </section>
    <h1 class="mt-5 font-semibold">Explore by Categories</h1>
    <Categories />
    <hr class="m-5" />
    <h1 class="mt-5 font-semibold">Our Products</h1>
    <ProductList />
  </section>
</template>
