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
  TokenService.generateToken();
};

const sideSheet = ref<"bottom" | "right">("bottom");
onMounted(() => {
  if (window.innerWidth > 520) {
    sideSheet.value = "right";
  } else {
    sideSheet.value = "bottom";
  }
});

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

const cartStore = useCartStore();
const addQty = (item: Product) => {
  cartStore.addToCart(item);
};
const reduceQty = (item: CartItem) => {
  cartStore.reduceFromCart(item);
};
const handleDeleteCart = (itemid: string) => {
  cartStore.removeFromCart(itemid);
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
      class="hidden bg-slate-50 px-5 py-2 md:flex md:items-center md:justify-between"
    >
      <RouterLink to="/">
        <div id="logo" class="flex items-center gap-1">
          <img
            src="/images/alams-logo.png"
            alt="alams-logo"
            class="w-10 h-10"
          />
          <h3 class="font-semibold text-primary">AlamShop</h3>
        </div>
      </RouterLink>

      <div id="nv-menu" class="flex justify-between items-center gap-4">
        <div class="relative w-full max-w-sm items-center">
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
        <div id="cart">
          <Sheet>
            <SheetTrigger asChild>
              <div class="relative p-3 leading-3 cursor-pointer">
                <i class="pi pi-shopping-cart" style="font-size: 1.2rem"></i>
                <div class="absolute top-0 right-0">
                  <Badge class="text-xs h-3 p-2">{{
                    cartStore.itemCount
                  }}</Badge>
                </div>
              </div>
            </SheetTrigger>

            <SheetContent :side="sideSheet" class="h-[500px] md:h-full">
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
                                    @click="reduceQty(item)"
                                  />
                                  <NumberFieldInput class="w-16 text-xs h-5" />
                                  <NumberFieldIncrement
                                    class="text-xs p-1"
                                    @click="addQty(item)"
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
                        <Button
                          type="submit"
                          class="w-full"
                          @click="generateToken"
                          >Checkout
                        </Button>
                      </RouterLink>
                    </SheetClose>
                  </SheetFooter>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div id="track">
          <!-- <TrackOrderButton /> -->
          <RouterLink to="/track-order">
            <Button variant="outline">
              <i class="pi pi-truck" style="font-size: 1.2rem"></i>
              Track Order
            </Button>
          </RouterLink>
        </div>
      </div>
    </nav>
    <nav class="md:hidden grid grid-cols-1 bg-slate-50 px-2 py-2">
      <div id="nvtop" class="flex justify-between items-center">
        <RouterLink to="/">
          <div id="logo" class="flex items-center gap-1">
            <img
              src="/images/alams-logo.png"
              alt="alams-logo"
              class="w-10 h-10"
            />
            <h3 class="font-semibold text-primary">AlamShop</h3>
          </div>
        </RouterLink>
        <div id="nv-menu-mo" class="flex justify-between items-center gap-4">
          <div id="cart">
            <Sheet>
              <SheetTrigger asChild>
                <div class="relative p-3 leading-3 cursor-pointer">
                  <i class="pi pi-shopping-cart" style="font-size: 1.2rem"></i>
                  <div class="absolute top-0 right-0">
                    <Badge class="text-xs h-3 p-2">{{
                      cartStore.itemCount
                    }}</Badge>
                  </div>
                </div>
              </SheetTrigger>

              <SheetContent :side="sideSheet" class="h-[500px] md:h-full">
                <div class="flex flex-col justify-between items-center h-full">
                  <div class="w-full">
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
                                      @click="reduceQty(item)"
                                    />
                                    <NumberFieldInput
                                      class="w-16 text-xs h-5"
                                    />
                                    <NumberFieldIncrement
                                      class="text-xs p-1"
                                      @click="addQty(item)"
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
                          <Button
                            type="submit"
                            class="w-full"
                            @click="generateToken"
                            >Checkout
                          </Button>
                        </RouterLink>
                      </SheetClose>
                    </SheetFooter>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div id="track">
            <RouterLink to="/track-order">
              <Button variant="outline">
                <i class="pi pi-truck" style="font-size: 1.2rem"></i>
                Track Order
              </Button>
            </RouterLink>
          </div>
        </div>
      </div>
      <div id="nvbtm" class="mt-2">
        <div class="relative w-full items-center">
          <Input
            id="search"
            type="text"
            placeholder="Search..."
            class="pl-8 h-9 !w-full"
            @change="handleSearch"
            v-model="query"
          />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2 text-slate-500"
          >
            <i class="pi pi-search" style="font-size: 0.9rem"></i>
          </span>
        </div>
      </div>
    </nav>
  </header>
</template>
