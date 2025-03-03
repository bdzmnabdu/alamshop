import { createRouter, createWebHistory } from "vue-router";
import { TokenService } from "../services/TokenService";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/HomeView.vue"),
      beforeEnter: async (_to, from, next) => {
        if (from.name === "Success") TokenService.removeToken();
        next();
      },
    },
    {
      path: "/products/fishery/:catId",
      name: "ProductsViews",
      component: () => import("@/views/ProductsView.vue"),
    },
    { path: "/search", component: () => import("@/views/SearchView.vue") },
    {
      path: "/checkout",
      name: "Checkout",
      component: () => import("@/views/CheckoutView.vue"),
      beforeEnter: async (_to, _from, next) => {
        const token = TokenService.getToken();
        if (token && (await TokenService.verifyToken(token))) {
          next();
        } else {
          next("/");
        }
      },
    },
    {
      path: "/logistics",
      name: "Logistics",
      component: () => import("@/views/LogisticsView.vue"),
    },
    {
      path: "/checkout/success",
      name: "Success",
      component: () => import("@/views/SuccessView.vue"),
      beforeEnter: async (_to, from, next) => {
        const token = TokenService.getToken();
        if (token && (await TokenService.verifyToken(token))) {
          next();
        } else {
          if (from.name === "Logistics") {
            next();
          }
          next("/");
        }
      },
    },
    {
      path: "/track-order",
      name: "TrackOrder",
      component: () => import("@/views/TrackOrderView.vue"),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
