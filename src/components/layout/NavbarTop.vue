<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store";
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
import { onMounted, ref } from "vue";
import { TokenService } from "@/services/TokenService";

const router = useRouter();
const query = ref<string>("");

const generateToken = () => {
  const token = TokenService.getToken();
  if (!token) TokenService.generateToken();
  router.push("/checkout");
};

const sideSheet = ref<"bottom" | "right">("bottom");
onMounted(() => {
  if (window.innerWidth > 520) {
    sideSheet.value = "right";
  } else {
    sideSheet.value = "bottom";
  }
});

const cartStore = useCartStore();

const reduceQty = (productId: string, cond: string) => {
  cartStore.reduceFromCart(productId, cond);
};
const handleDeleteCart = (productId: string, cond: string) => {
  cartStore.removeFromCart(productId, cond);
};

const handleSearch = () => {
  console.log(query.value);
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
          type="text"
          placeholder="Search..."
          class="pl-8 h-9 w-full"
          @change="handleSearch"
          v-model="query"
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-2 text-slate-500"
        >
          <i class="pi pi-search" style="font-size: 0.9rem"></i>
        </span>
      </div>
      <div
        id="cart"
        class="order-3 grid grid-cols-[auto_auto] items-center justify-self-end"
      >
        <Sheet>
          <SheetTrigger asChild>
            <div class="relative p-3 leading-3 cursor-pointer">
              <i class="pi pi-shopping-cart" style="font-size: 1.2rem"></i>
              <div class="absolute top-0 right-0">
                <Badge class="text-xs h-3 p-2">{{ cartStore.itemCount }}</Badge>
              </div>
            </div>
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
                              @click="
                                handleDeleteCart(item.product_id, item.cond)
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
                  <SheetClose v-if="cartStore.itemCount" class="w-full">
                    <RouterLink to="/checkout">
                      <Button
                        type="submit"
                        class="w-full md:float-right text-base h-11 md:h-9 md:text-sm"
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
