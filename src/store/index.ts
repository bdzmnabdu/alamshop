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

type CartItem = Product & {
  quantity: number;
};
export const useCartStore = defineStore("cart", () => {
  const state = reactive<{ cart: CartItem[] }>({
    cart: [],
  });

  const itemCount = computed(() => {
    // console.log(state.cart);
    return state.cart.length;
  });

  const addToCart = (product: Product) => {
    const existingProduct = state.cart.find(
      (item: Product) => item.product_id === product.product_id
    );
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      state.cart.unshift({ ...product, quantity: 1 });
    }
    console.log(state.cart);
  };

  const reduceFromCart = (product: CartItem) => {
    console.log(product);
    const productId = product.product_id;
    const findProduct = state.cart.find(
      (item: CartItem) => item.product_id === productId
    );
    console.log(findProduct);
    if (findProduct && findProduct.quantity > 0) {
      findProduct.quantity--;
    } else {
      removeFromCart(productId);
    }
    console.log(state.cart);
  };
  const removeFromCart = (productId: string) => {
    state.cart = state.cart.filter((item) => item.product_id !== productId);
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
