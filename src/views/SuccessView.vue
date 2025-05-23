<script setup lang="ts">
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import { TokenService } from "@/services/TokenService";
import { onBeforeUnmount } from "vue";

onBeforeUnmount(() => {
  TokenService.removeToken();
});
</script>
<template>
  <section
    class="text-center flex flex-col justify-center items-center mb-9 mx-2 md:mx-32 flex-1"
  >
    <div class="w-[370px] md:w-[500px] h-auto overflow-hidden">
      <DotLottieVue
        id="scs-anm"
        autoplay
        loop
        src="https://lottie.host/855a7d3c-1f13-4e78-a351-9b32702624f4/S6AzNI7BNr.lottie"
        class="-mt-16 w-[370px] h-[370px] md:w-[500px] wd:h-[500px]"
      />
    </div>
    <div class="-mt-14">
      <h1 class="text-4xl font-bold mb-4">Success</h1>
      <p class="text-lg text-slate-600 mb-5">
        Thank you for visiting our page!
      </p>
      <RouterLink
        to="/"
        class="text-white bg-orange-500 hover:bg-orange-300 rounded-xl px-3 py-2 mt-4 mb-20"
        >Back to Home</RouterLink
      >
    </div>
  </section>
</template>
