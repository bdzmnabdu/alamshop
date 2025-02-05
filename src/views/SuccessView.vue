<script setup lang="ts">
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import { TokenService } from "@/services/TokenService";
import { useRouter } from "vue-router";

const router = useRouter();

const token = TokenService.getToken();
if (!token && !TokenService.verifyToken(token as string)) {
  router.push("/");
}
</script>
<template>
  <section
    class="text-center flex flex-col justify-center items-center mb-9 mx-2 md:mx-32 flex-1"
  >
    <DotLottieVue
      style="height: 500px; width: 500px"
      autoplay
      loop
      src="https://lottie.host/855a7d3c-1f13-4e78-a351-9b32702624f4/S6AzNI7BNr.lottie"
      class="-mt-20"
    />
    <div class="-mt-28">
      <h1 class="text-4xl font-bold mb-4">Success</h1>
      <p class="text-lg text-slate-600 mb-5">
        Thank you for visiting our page!
      </p>
      <RouterLink
        to="/"
        class="text-white bg-orange-400 hover:bg-orange-600 rounded-md px-3 py-2 mt-4 mb-20"
        >Shop Again</RouterLink
      >
    </div>
  </section>
</template>
