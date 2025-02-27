<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import {
//   NumberField,
//   NumberFieldContent,
//   NumberFieldDecrement,
//   NumberFieldIncrement,
//   NumberFieldInput,
// } from "@/components/ui/number-field";
import { useCartStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import RadioForm from "@/components/common/RadioForm.vue";
import { TokenService } from "@/services/TokenService";
import { RouterLink, useRouter } from "vue-router";
import type { CartItem } from "@/store";
import Cart from "./Cart.vue";

// type Product = {
//   product_id: string;
//   product_name: string;
//   catid: string;
//   product_type: string;
//   uom: string;
//   description: string | null;
//   createdinfo: string;
//   modifiedinfo: string | null;
//   cat_name: string;
//   name_type: string;
//   image_url: string;
// };

// type CartItem = Product & {
//   quantity: number;
//   cond: string;
// };

// const router = useRouter();
const props = defineProps<{ product: CartItem }>();

const cartStore = useCartStore();

// const generateToken = () => {
//   const token = TokenService.getToken();
//   if (token) return;
//   TokenService.generateToken();
//   router.push("/checkout");
// };

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

// const reduceQty = (productId: string, cond: string) => {
//   cartStore.reduceFromCart(productId, cond);
// };

// const handleDeleteCart = (productId: string, cond: string) => {
//   cartStore.removeFromCart(productId, cond);
// };
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
                    <div
                      size="icon"
                      @click.prevent="handleAddToCart"
                      class="w-full rounded-xl text-sm bg-orange-500 hover:bg-orange-200 text-white hover:text-orange-900 py-2 px-3 cursor-pointer text-center"
                    >
                      Add to cart
                    </div>
                  </template>
                </Cart>
                <!-- <Sheet>
                  <SheetTrigger asChild v-if="selectedOption">
                    <div
                      size="icon"
                      @click.prevent="handleAddToCart"
                      class="w-full rounded-xl text-sm bg-orange-500 hover:bg-orange-200 text-white hover:text-orange-900 py-2 px-3 cursor-pointer text-center"
                    >
                      Add to cart
                    </div>
                  </SheetTrigger>
                  <SheetContent
                    :side="sideSheet"
                    class="h-[500px] md:h-full data-[state=open] p-0"
                  >
                    <div
                      class="flex flex-col justify-between items-center h-full"
                    >
                      <div class="w-11/12 mt-5">
                        <SheetHeader class="text-left">
                          <SheetTitle
                            >My Cart({{ cartStore.itemCount }})</SheetTitle
                          >
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
                            <div
                              id="cnt-itm"
                              class="flex flex-col gap-1 w-full"
                            >
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
                                    <NumberField
                                      :min="-1"
                                      v-model="item.quantity"
                                    >
                                      <NumberFieldContent>
                                        <NumberFieldDecrement
                                          class="text-xs p-1"
                                          @click="
                                            reduceQty(
                                              item.product_id,
                                              item.cond
                                            )
                                          "
                                        />
                                        <NumberFieldInput
                                          class="w-16 text-xs h-5"
                                        />
                                        <NumberFieldIncrement
                                          class="text-xs p-1"
                                        />
                                      </NumberFieldContent>
                                    </NumberField>
                                    <p>{{ item.uom }}</p>
                                  </div>
                                  <div id="delcart">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      class="w-5 h-5"
                                      @click="
                                        handleDeleteCart(
                                          item.product_id,
                                          item.cond
                                        )
                                      "
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
                      <div
                        v-else
                        class="flex-1 flex flex-col items-center justify-center"
                      >
                        <img
                          src="@/assets/images/empty-cart.png"
                          alt=""
                          class="w-44 h-44"
                        />
                        <p class="-mt-3 text-slate-600">No items in cart</p>
                      </div>
                      <div class="bg-neutral-100 p-2 w-full mt-auto">
                        <SheetFooter>
                          <SheetClose
                            v-if="cartStore.itemCount > 0"
                            class="w-full"
                          >
                            <RouterLink to="/checkout">
                              <Button
                                @click="generateToken"
                                type="submit"
                                class="w-full text-base h-11 md:h-9 md:text-sm"
                                >Checkout ({{ cartStore.itemCount }})
                              </Button>
                            </RouterLink>
                          </SheetClose>
                          <Button
                            v-else
                            disabled
                            type="submit"
                            class="w-full text-base h-11 md:h-9 md:text-sm"
                            >Checkout ({{ cartStore.itemCount }})
                          </Button>
                        </SheetFooter>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet> -->
              </div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
