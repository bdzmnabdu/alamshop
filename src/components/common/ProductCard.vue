<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import { useCartStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import RadioForm from "@/components/common/RadioForm.vue";
import type { CartItem } from "@/types";
import Cart from "./Cart.vue";

const props = defineProps<{ product: CartItem }>();

const cartStore = useCartStore();

const bdgProduct = (prd: string) => {
  prd = prd.split("-")[0];
  type Bdg = {
    [key: string]: string;
  };
  const bdg: Bdg = {
    AOF: "Ornamental Freshwater",
    AOS: "Ornamental Saltwater",
    AC: " Consumption",
    AFF: "Fry Fish",
    AK: "Sea Food",
  };
  return bdg[prd];
};

const selectedOption = ref<string>("");
const sideSheet = ref<"bottom" | "right">("bottom");
onMounted(() => {
  if (window.innerWidth > 520) {
    sideSheet.value = "right";
  } else {
    sideSheet.value = "bottom";
  }
});

const formatTitle = (title: any) => {
  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
};

const handleAddToCart = () => {
  if (!selectedOption.value) return;
  cartStore.addToCart(props.product, selectedOption.value);
};
</script>
<template>
  <div class="rounded-2xl w-full overflow-hidden flex flex-col">
    <Dialog>
      <DialogTrigger class="text-left">
        <div class="flex-1 flex flex-col">
          <div
            class="h-40 2xl:h-50 object-cover overflow-clip bg-white rounded-2xl hover:border-2 hover:border-slate-200 w-full flex items-center justify-center"
          >
            <img
              v-if="product?.image_url"
              :src="product?.image_url"
              alt=""
              class="w-40 h-40 2xl:w-50 2xl:h-50 object-cover"
            />
            <div
              v-else
              class="w-full h-[150px] flex justify-center items-center"
            >
              <i class="pi pi-image text-[50px] text-secondary"></i>
            </div>
          </div>
          <div class="w-full p-2">
            <p
              class="text-sm lg:text-sm 2xl:text-base mt-1 leading-tight break-words"
            >
              {{ formatTitle(product?.product_name) }}
            </p>
            <Badge
              variant="outline"
              class="mt-1.5 text-[12px] 2xl:text-sm font-normal bg-orange-100 text-orange-950 border-none"
            >
              {{ bdgProduct(product?.product_id) }}
            </Badge>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent class="h-fit w-[330px] md:w-[450px] rounded-2xl">
        <div class="flex-1 flex flex-col">
          <div
            class="h-60 2xl:h-70 object-cover overflow-clip bg-white rounded-2xl w-full flex items-center justify-center"
          >
            <img
              v-if="product?.image_url"
              :src="product?.image_url"
              alt=""
              class="w-60 h-60 2xl:w-70 2xl:h-70 object-cover"
            />
            <div
              v-else
              class="w-full h-[150px] flex justify-center items-center"
            >
              <i class="pi pi-image text-[50px] text-secondary"></i>
            </div>
          </div>
          <div class="w-full p-2">
            <p
              class="text-sm lg:text-sm 2xl:text-base mt-1 leading-tight break-words"
            >
              {{ formatTitle(product?.product_name) }}
            </p>
            <Badge
              variant="outline"
              class="mt-1.5 text-[12px] 2xl:text-sm font-normal bg-orange-100 text-orange-950 border-none"
            >
              {{ bdgProduct(product?.product_id) }}
            </Badge>
            <div id="cond" class="mt-4">
              <p>Condition</p>

              <RadioForm
                v-model:selected-option="selectedOption"
                :product-id="product?.product_id"
              />
            </div>
          </div>
        </div>
        <hr />
        <DialogFooter>
          <div id="card-content" class="p-2">
            <div id="btn-act" class="w-full">
              <div id="dtl-prd" class="flex justify-between items-center gap-2">
                <Cart
                  :selected-option="selectedOption"
                  :side-sheet="sideSheet"
                  :cart-store="cartStore"
                >
                  <template #prdcart>
                    <button
                      :disabled="selectedOption === ''"
                      size="icon"
                      @click.prevent="handleAddToCart"
                      class="w-full rounded-xl text-sm py-2 px-3 cursor-pointer text-center"
                      :class="
                        selectedOption
                          ? 'bg-orange-500 hover:bg-orange-200 text-white hover:text-orange-900'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      "
                    >
                      Add to cart
                    </button>
                  </template>
                </Cart>
              </div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
