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
    plan: [{ date: new Date(), meals: [{ name: "Oatmeal" }, { name: "Tikka Masala" }] }]
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
    },
    addmeal(store, name) {
      const date = store.selectedDate;

      const i = store.plan.findIndex(p => isSameDate(date, p.date) )

      if (i === -1) {
        store.plan.push({ date, meals: [{ name }] });
      } else {
        store.plan[i].meals.push({ name });
      }
    },
    removemeal(store, meal) {
      const i = store.plan.findIndex(p => isSameDate(store.selectedDate, p.date));
      store.plan[i].meals = store.plan[i].meals.filter(m => m !== meal)
    },
    editmeal(store, newName, mealIdx, d) {
      console.log(d, mealIdx, newName);
      const i = store.plan.findIndex(p => { 
        
        return isSameDate(d, p.date) })
      store.plan[i].meals[mealIdx].name = newName
    }
  },
  actions: {}
});

const isSameDate = (d1, d2) => {
  return d1.getDate() == d2.getDate() && d1.getMonth() == d2.getMonth() && d1.getFullYear() == d2.getFullYear();
}