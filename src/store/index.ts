import { defineStore } from "pinia";
import { reactive, computed } from "vue";

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

export type CartItem = Product & {
  quantity: number;
  cond: string;
};
export const useCartStore = defineStore("cart", () => {
  const state = reactive<{ cart: CartItem[] }>({
    cart: [],
  });

  const itemCount = computed(() => {
    return state.cart.length;
  });

  const addToCart = (product: Product, cond: string) => {
    console.log(cond);
    const existingProduct = state.cart.find(
      (item: CartItem) =>
        item.product_id === product.product_id && item.cond === cond
    );

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      state.cart.unshift({ ...product, quantity: 1, cond });
    }

    console.log(state.cart);
  };

  const reduceFromCart = (productId: string, cond: string) => {
    const findProduct = state.cart.find(
      (item: CartItem) => item.product_id === productId && item.cond === cond
    );
    console.log(findProduct);
    if (findProduct && findProduct.quantity < 1) {
      removeFromCart(productId, cond);
    }
  };

  const removeFromCart = (productId: string, cond: string) => {
    state.cart = state.cart.filter(
      (item: CartItem) => item.product_id !== productId || item.cond !== cond
    );
  };

  const clearCart = () => {
    state.cart = [];
  };

  return {
    state,
    itemCount,
    addToCart,
    reduceFromCart,
    removeFromCart,
    clearCart,
  };
});

export const useTrackOrderStore = defineStore("trackOrder", () => {
  const state = reactive<{ ordernum: string; data: any; reTrack: any }>({
    ordernum: "",
    data: {},
    reTrack: null,
  });
  const trackOrder = (data: any) => {
    state.data = data;
  };

  return {
    state,
    trackOrder,
  };
});
