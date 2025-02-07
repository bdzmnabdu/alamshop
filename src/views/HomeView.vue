<script setup lang="ts">
import Categories from "@/components/layout/Categories.vue";
import ProductList from "@/components/layout/ProductList.vue";
import { onMounted, ref } from "vue";
import { TokenService } from "@/services/TokenService";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <div
        v-else
        :class="`w-full h-fit rounded-2xl bg-center border-2 border-neutral-100 flex items-center md:p-20 p-3`"
        :style="{
          backgroundImage: 'url(/images/pln4-04.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
        }"
      >
        <div class="h-full md:h-[100%] w-[60%] md:w-[40%]">
          <h1 class="font-bold md:text-2xl mb-3 md:mb-12">
            You Order, We Deliver, Safely to Your Destination!
          </h1>
          <RouterLink to="/logistics">
            <Button
              :class="
                cn(
                  'bg-orange-500 hover:bg-orange-300 text-white text-sm font-medium rounded-xl shadow-none p-5'
                )
              "
              @click="generateToken"
              >Start Sending
            </Button>
          </RouterLink>
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
