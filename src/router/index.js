import { createRouter, createWebHistory } from "vue-router";
import jwt from 'jsonwebtoken'
import Landing from '../views/Landing.vue'
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    meta: {
      requiresAuth: false
    },
    component: Landing,
  },
  {
    path: "/about",
    name: "About",
    meta: {
      requiresAuth: false
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/users/:id",
    name: "profile",
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Profile.vue"),
  },
  {
    path: "/boards",
    name: "Boards",
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Boards.vue"),
  },
  {
    path: "/boards/:id",
    name: "BoardDetails",
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/BoardDetails.vue"),
  },
];

const refresh_token_valid = () => {
  const refresh_token = localStorage.getItem('refresh_token')
  if(refresh_token === null){
      return false
  }
  const payload = jwt.decode(refresh_token)
  if(Math.floor(Date.now() / 1000) > payload.exp){
      return false
  }
  return true
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const tokenValid = refresh_token_valid()
  //if already logged in, return to previous page...
  if (to.name === 'Login' && tokenValid){
    //...or to /home if user just entered the app form outside
    if(!from.name){
      next({ name: 'Home'})
    }else{
      next({ name: from.name})
    }
  }else if (to.meta.requiresAuth && !tokenValid) {
    next({ name: 'Login', query: {redirect: to.fullPath}})
  } else {
    next()
  }
})

export default router;
