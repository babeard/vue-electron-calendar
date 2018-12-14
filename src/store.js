import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const getRandomDate = () => {
  const start = new Date()
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay())

  const end = new Date(start);
  end.setDate(end.getDate() + 6)

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export default new Vuex.Store({
  state: {
    selectedDate: new Date(),
    locale: "en-US",
    plan: [{ date: new Date(), meals: [{ name: "meal" }, { name: "meal 2" }] }]
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
