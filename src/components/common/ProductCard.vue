<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
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
import { useCartStore } from "@/store";

type Product = {
  product_id: string;
  product_name: string;
  catid: string;
  product_type: string;
  uom: string;
  description: string | null;
  createdinfo: string;
  modifiedinfo: string | null;
  cat_name: string;
  name_type: string;
  image_url: string;
};

type CartItem = Product & {
  quantity: number;
};

const props = defineProps<{ product: CartItem }>();

const cartStore = useCartStore();

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

// const productInCart = computed(() => {
//   return (
//     cartStore.state.cart.find(
//       (item: any) => item.product_id === props.product?.product_id
//     ) || { quantity: 0 }
//   );
// });

const handleAddToCart = () => {
  cartStore.addToCart(props.product);
};

const addQty = () => {
  cartStore.addToCart(props.product);
};

const reduceQty = () => {
  cartStore.reduceFromCart(props.product);

  // console.log(props?.product?.product_id);
  // if (productInCart.value.quantity === 1) {
  //   cartStore.removeFromCart(props?.product?.product_id);
  // } else {
  // }
};

const handleDeleteCart = (itemid: string) => {
  cartStore.removeFromCart(itemid);
};
</script>

<template>
  <div
    class="border border-neutral-200 rounded-xl hover:shadow-lg w-full overflow-hidden flex flex-col"
  >
    <div class="flex-1 flex flex-col">
      <div class="h-40 border-b object-cover overflow-clip">
        <img
          v-if="product?.image_url"
          :src="product?.image_url"
          alt=""
          width="150"
          height="150"
          class="w-full object-cover"
        />
        <div v-else class="w-full h-[150px] flex justify-center items-center">
          <i class="pi pi-image text-[50px] text-secondary"></i>
        </div>
      </div>
      <div class="w-full p-2">
        <p class="text-sm mt-1 leading-tight break-words">
          {{ formatTitle(product?.product_name) }}
        </p>
      </div>
    </div>
    <div id="card-content" class="p-2">
      <div id="btn-act" class="w-full">
        <div id="dtl-prd" class="flex justify-between items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <div
                size="icon"
                @click.prevent="handleAddToCart"
                class="w-full rounded-lg text-sm bg-orange-100 hover:bg-orange-500 text-orange-900 hover:text-white p-2 cursor-pointer text-center"
              >
                Add to cart
              </div>
            </SheetTrigger>
            <SheetContent
              :side="sideSheet"
              class="h-[500px] md:h-full data-[state=open]"
            >
              <div class="flex flex-col justify-between items-center h-full">
                <div class="w-full">
                  <SheetHeader class="text-left">
                    <SheetTitle>My Cart({{ cartStore.itemCount }})</SheetTitle>
                    <SheetDescription
                      >Total item in your cart:
                      {{ cartStore.itemCount }}</SheetDescription
                    >
                  </SheetHeader>
                  <hr class="m-2" />
                  <ScrollArea>
                    <div id="cart" class="w-full h-[330px] md:h-[470px]">
                      <div
                        v-for="item in cartStore.state.cart"
                        :key="item.product_id"
                        class="flex items-center gap-2 border rounded-md my-2 p-1"
                      >
                        <div
                          id="img-itm"
                          class="w-20 h-10 rounded-md overflow-hidden bg-white"
                        >
                          <img
                            :src="item.image_url"
                            alt=""
                            class="w-full object-cover"
                          />
                        </div>
                        <div id="cnt-itm" class="flex flex-col gap-1 w-full">
                          <p class="font-normal text-sm">
                            {{ item.product_name }}
                          </p>
                          <div class="flex justify-between items-center">
                            <div
                              id="act"
                              class="flex items-center justify-between w-full"
                            >
                              <NumberField
                                :min="0"
                                :default-value="item.quantity"
                              >
                                <NumberFieldContent>
                                  <NumberFieldDecrement
                                    class="text-xs p-1"
                                    @click="reduceQty"
                                  />
                                  <NumberFieldInput class="w-16 text-xs h-5" />
                                  <NumberFieldIncrement
                                    class="text-xs p-1"
                                    @click="addQty"
                                  />
                                </NumberFieldContent>
                              </NumberField>
                              <div id="delcart">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  class="w-5 h-5"
                                  @click="handleDeleteCart(item.product_id)"
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
                </div>
                <div class="bg-neutral-100 p-2 rounded-md w-full">
                  <SheetFooter>
                    <SheetClose>
                      <RouterLink to="/checkout">
                        <Button type="submit" class="w-full">Checkout </Button>
                      </RouterLink>
                    </SheetClose>
                  </SheetFooter>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </div>
</template>
