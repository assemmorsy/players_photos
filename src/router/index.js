import { createRouter, createWebHistory } from "vue-router";
import { projectAuth } from "@/firebase/config";

// Auth Guards
const shouldLogin = (to, from, next) => {
  const user = projectAuth.currentUser;
  if (user) {
    next();
  } else {
    sessionStorage.setItem("path", JSON.stringify(to));
    next({ name: "login" });
  }
};

const ifLoggedIn = (to, from, next) => {
  const user = projectAuth.currentUser;
  if (user) {
    next({ name: "board" });
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/nashra",
      name: "Nashra",
      component: () => import("@/views/NashraView.vue"),
    },
    {
      path: "/top",
      name: "top",
      component: () => import("@/views/TopView.vue"),
    },

    {
      path: "/bottom",
      name: "bottom",
      component: () => import("@/views/BottomView.vue"),
    },
    {
      path: "/left",
      name: "left",
      component: () => import("@/views/LeftView.vue"),
    },
    {
      path: "/right",
      name: "right",
      component: () => import("@/views/RightView.vue"),
    },
    {
      path: "/calc",
      name: "calc",
      component: () => import("@/views/CalculatorView.vue"),
    },
    {
      path: "/qayyed",
      name: "qayyed",
      component: () => import("@/views/Qayyed.vue"),
      beforeEnter: shouldLogin,
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/views/AdminView.vue"),
      children: [
        {
          path: "",
          name: "board",
          component: () => import("@/components/board/BoardPlayers.vue"),
        },
        {
          path: "all-players",
          name: "all-players",
          component: () => import("@/components/players/AllPlayers.vue"),
        },
        {
          path: "add-player",
          name: "add-player",
          component: () => import("@/components/players/AddPlayer.vue"),
        },
        {
          path: "update-player/:id",
          name: "update-player",
          component: () => import("@/components/players/UpdatePlayer.vue"),
          props: true,
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("@/components/Settings.vue"),
        },
        {
          path: "record",
          name: "record",
          component: () => import("@/components/Records.vue"),
        },
        {
          path: "links",
          name: "links",
          component: () => import("@/components/Links.vue"),
        },

        {
          path: "all-sponcers",
          name: "all-sponcers",
          component: () => import("@/components/sponcers/AllSponcers.vue"),
        },
        {
          path: "add-sponcer",
          name: "add-sponcer",
          component: () => import("@/components/sponcers/AddSponcer.vue"),
        },
        {
          path: "update-sponcer/:id",
          name: "update-sponcer",
          component: () => import("@/components/sponcers/UpdateSponcer.vue"),
          props: true,
        },
      ],
      beforeEnter: shouldLogin,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      beforeEnter: ifLoggedIn,
    },
  ],
});

export default router;
