import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/index.vue";
import History from "@/pages/history.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/history",
      name: "History",
      component: History,
    },
    {
      /* path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue') */
    },
  ],
});

export default router;
