<template>
  
  <div class="bg-white m-3 p-8 rounded border">

    <!-- Title & Week Selector -->
    <div class="flex justify-between leading-loose font-bold text-grey-darker font-sans text-lg select-none">
      <div :title="selected.isToday ? 'Today':''">
        <span>{{ selected.day }}</span>,
        <span class="text-grey font-medium">
          {{ selected.month }} {{ selected.date }}<span class="text-grey-light" v-if="selected.year !== (new Date()).getFullYear()">, {{ selected.year }}</span>
        </span>
      </div>
      <div class="select-none font-mono w-1/6 flex justify-around justify-center items-center text-grey">
        <div class="cursor-pointer hover:text-grey-darker" @click="changeWeek(-1)" title="Previous Week">&lt;</div>
        <div class="cursor-pointer hover:bg-grey-darker rounded-full bg-grey w-1 h-1" @click="changeSelection(new Date())" title="Go to today"></div>
        <div class="cursor-pointer hover:text-grey-darker" @click="changeWeek(1)" title="Next Week"> &gt;</div>
      </div>
    </div>
    
    <!-- Week -->
    <div class="flex justify-between mt-2 font-sans leading-loose font-medium select-none">
      <div v-for="(d,i) in week" @click="changeSelection(d.date)" :key="i" class="w-12 flex flex-col items-center cursor-pointer text-grey-darker">
        <div class="text-grey">{{ d.day }}</div>
          <div 
            class="h-8 w-8 flex items-center justify-center text-sm font-bold rounded-full mt-3" 
            :class="[
              isSelected(d.date) ? 'text-white bg-green' : '',
              isToday(d.date) ? 'border border-green' : '',
            ]"
          >
            {{ d.date.getDate() }}
          </div>
          <div class="flex flex-wrap text-green justify-center text-xl">
            <span v-for="(m,idx) in dayMeals(d.date)" :key="idx" class="w-1 h-1 rounded-full bg-green m-px mt-2"></span>
          </div>
        
      </div>
    </div>

    <!-- List -->
    <div class="mt-10" v-if="showMealForm">
      <form class="w-full max-w-md" @submit.prevent>
        <div class="flex flex-wrap -mx-3">
          <div class="w-full md:w-1/2 px-3 md:mb-0">
            <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-name">Meal Name</label>
            <input 
              v-model="newMeal" 
              class="appearance-none block w-full bg-grey-lightest border border-grey-lighter text-grey-darker rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:text-green-darker" 
              :class="{'border-red': mealNameInvalid }"
              id="grid-name" 
              type="text"
              @keypress.enter="handleAddMeal"
              v-focus
            >
            <p v-if="mealNameInvalid" class="text-red text-xs italic">Please fill out this field.</p>
          </div>
        </div>
      </form>
    </div>
    <div v-else class="mt-8">
      <div v-for="(meal, index) in selectedMeals" :key="index" class="flex text-lg text-grey-darkest justify-between p-6 border-b border-grey-lighter mb-2 rounded hover:border-grey">
        <div class="">{{meal.name}}</div>
        <div class="flex items-center justify-between">
          <div class="flex items-center text-xs text-green mr-2 cursor-pointer select-none" @click="handleEditMeal(meal, index)">edit</div>
          <div class="flex items-center justify-center cursor-pointer text-xs p-1 rounded-full bg-red-dark text-white select-none" @click="handleRemoveMeal(meal, index)">remove</div>
        </div>
      </div>
    </div>
    <div class=" w-full flex lg:justify-center mt-10">
      <button v-if="showMealForm" class="focus:outline-none hover:text-green w-full lg:w-1/4 mb-5 mt-5" @click="hideForm">
        Cancel
      </button>
      <button @click="handleAddMeal" class="w-full lg:w-1/4 border bg-green hover:bg-white hover:border-green hover:text-green text-white py-3 px-4 rounded focus:outline-none focus:border-green-dark focus:shadow-inner" type="button">
        <span v-if="editMode">Save</span>
        <span v-else>Add Meal</span>

      </button>

    </div>
    
    
  </div>
</template>

<style>
  .week-slider-enter {
    transform: translate(-100%, 0);
  }
  .week-slider-enter-active, .week-slider-leave-active {
    transition: 1s;
  }
</style>

<script>
export default {
  name: "week",
  methods: {
    changeWeek(direction) {
      this.$store.commit('changeweek', direction)
    },
    changeSelection(date) {
      this.$store.commit('changeselection', date)
    },
    isToday(date) {
      const now = new Date()
      return date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear();
    },
    isSelected(date) {
      const selectedDate = this.$store.state.selectedDate
      return date.getDate() == selectedDate.getDate() && date.getMonth() == selectedDate.getMonth() && date.getFullYear() == selectedDate.getFullYear();
    },
    handleAddMeal() {
      // Show the form if not shown
      if (!this.showMealForm) {
        this.showMealForm = true
        return
      }

      // Check for empty state
      if(!this.newMeal) { 
        this.mealNameInvalid = true
        return
      }

      if(this.editMode) {
        // Edit Instead
        console.log(this.newMeal, this.editIdx, this.selectedDateAtEdit)
        this.$store.commit("editmeal", this.newMeal, this.editIdx, this.selectedDateAtEdit)
        
      } else {
        // Add to store
        this.$store.commit("addmeal", this.newMeal)
      }

      this.hideForm()
    },
    handleEditMeal(m,i) {
      console.log(m, i)
      this.selectedDateAtEdit = this.$store.state.selectedDate
      this.editMode = true
      this.newMeal = m.name
      this.showMealForm = true
      this.mealNameInvalid = false
      this.editIdx = i
    },
    handleRemoveMeal(m, i) {
      this.$store.commit("removemeal", m)
    },
    dayMeals(d) {
      const res = this.$store.state.plan.filter(p => {
        return d.getDate() == p.date.getDate() && d.getMonth() == p.date.getMonth() && d.getFullYear() == p.date.getFullYear();
      }).map(m => m.meals )
      return res[0]
    },
    hideForm() {
      // Reset local state
      this.mealNameInvalid = false
      this.newMeal = ''
      this.showMealForm = false
      this.editIdx = null
      this.editMode = false
    }
  },
  computed: {
    selected() {
      const { locale: l, selectedDate: s } = this.$store.state

      const day = s.toLocaleDateString(l, { weekday: 'long' })
      const date = s.getDate()
      const month = s.toLocaleDateString(l, { month: 'long' })
      const year = s.getFullYear()
      return { day, date, month, year, isToday: s.toDateString() == new Date().toDateString(), d: s }
    },

    week() {
      const { locale: l, selectedDate: s } = this.$store.state
      const d = new Date(s)

      // Set date to the first day of the week (default: Sunday)
      d.setDate(d.getDate() - d.getDay())

      const days = []

      for(let i = 0; i < 7; i++) {
        days.push({
          day: d.toLocaleDateString(l, { weekday: 'narrow' }),
          date: new Date(d)
        })

        d.setDate(d.getDate() + 1)
      }

      return days
    },
    selectedMeals() {
      return this.dayMeals(this.$store.state.selectedDate)
    }
    
  },
  data() {
    return {
      selectedDateAtEdit: new Date(),
      editIdx: null,
      showMealForm: false,
      newMeal: "",
      mealNameInvalid: false,
      editMode: false
    }
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  }
}
</script>