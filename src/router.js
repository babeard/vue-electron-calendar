import Vue from "vue";
import Router from "vue-router";
import Summary from "./views/Summary.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "summary",
      component: Summary
    }
  ]
});
