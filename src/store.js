import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedDate: new Date(),
    locale: "en-US"
  },
  mutations: {
    changeweek(store, direction) {
      const s = store.selectedDate;

      store.selectedDate = new Date(
        s.getFullYear(),
        s.getMonth(),
        s.getDate() + 7 * direction
      );
    },
    changeselection(store, date) {
      store.selectedDate = new Date(date);
    }
  },
  actions: {}
});
