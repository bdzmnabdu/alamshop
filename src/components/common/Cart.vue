<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCartStore } from "@/store";
import { TokenService } from "@/services/TokenService";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";

const router = useRouter();

const generateToken = async () => {
  let token = TokenService.getToken();
  if (!token) {
    try {
      token = await TokenService.generateToken();
    } catch (error) {
      return;
    }
  }
  router.push("/checkout");
};

const props = defineProps<{
  selectedOption?: string;
  sideSheet?: "bottom" | "right";
  cartStore: ReturnType<typeof useCartStore>;
}>();

const reduceQty = (productId: string, cond: string) => {
  props.cartStore.reduceFromCart(productId, cond);
};
const handleDeleteCart = (productId: string, cond: string) => {
  props.cartStore.removeFromCart(productId, cond);
};
</script>
<template>
  <Sheet>
    <SheetTrigger asChild>
      <slot name="navcart"></slot>
      <slot name="prdcart"></slot>
      <!-- <slot name="prdcart" v-if="selectedOption"></slot> -->
    </SheetTrigger>

    <SheetContent :side="sideSheet" class="h-[500px] md:h-full p-0">
      <div class="flex flex-col justify-between items-center h-full">
        <div class="w-11/12 mt-5">
          <SheetHeader class="text-left">
            <SheetTitle>My Cart({{ cartStore.itemCount }})</SheetTitle>
            <SheetDescription
              >Total item in your cart:
              {{ cartStore.itemCount }}</SheetDescription
            >
          </SheetHeader>
          <hr class="m-2" />
        </div>

        <ScrollArea
          v-if="cartStore.itemCount"
          class="flex-1 my-2 w-11/12 px-1 h-0 min-h-0"
        >
          <div id="cart" class="w-full h-full">
            <div
              v-for="(item, index) in cartStore.state.cart"
              :key="index"
              class="flex items-center gap-2 border rounded-md my-2 p-2"
            >
              <div
                id="img-itm"
                class="w-fit rounded-md overflow-hidden bg-white"
              >
                <img
                  :src="item.image_url"
                  alt=""
                  class="w-28 h-28 object-contain"
                />
              </div>
              <div id="cnt-itm" class="flex flex-col gap-1 w-full">
                <p class="font-normal text-sm">
                  {{ item.product_name }}
                </p>
                <p class="font-normal text-sm text-orange-500">
                  {{ item.cond }}
                </p>
                <div class="flex justify-between items-center">
                  <div
                    id="act"
                    class="flex items-center justify-between w-full"
                  >
                    <div class="flex items-center gap-2">
                      <NumberField :min="-1" v-model="item.quantity">
                        <NumberFieldContent>
                          <NumberFieldDecrement
                            class="text-xs p-1"
                            @click="reduceQty(item.product_id, item.cond)"
                          />
                          <NumberFieldInput class="w-16 text-xs h-5" />
                          <NumberFieldIncrement class="text-xs p-1" />
                        </NumberFieldContent>
                      </NumberField>
                      <p>{{ item.uom }}</p>
                    </div>
                    <div id="delcart">
                      <Button
                        variant="ghost"
                        size="icon"
                        class="w-5 h-5"
                        @click="handleDeleteCart(item.product_id, item.cond)"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <div v-else class="flex-1 flex flex-col items-center justify-center">
          <img src="@/assets/images/empty-cart.png" alt="" class="w-44 h-44" />
          <p class="-mt-3 text-slate-600">No items in cart</p>
        </div>
        <div class="bg-neutral-100 p-2 w-full mt-auto">
          <SheetFooter>
            <SheetClose v-if="cartStore.itemCount" class="w-full">
              <RouterLink to="/checkout">
                <Button
                  type="submit"
                  class="w-full md:float-right text-base h-11 md:h-9 md:text-sm cursor-pointer"
                  @click="generateToken"
                  >Checkout ({{ cartStore.itemCount }})
                </Button>
              </RouterLink>
            </SheetClose>
            <Button
              v-else
              disabled
              type="submit"
              @click="generateToken"
              class="w-full md:float-right text-base h-11 md:h-9 md:text-sm"
              >Checkout ({{ cartStore.itemCount }})
            </Button>
          </SheetFooter>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
