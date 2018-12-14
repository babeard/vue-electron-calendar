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
      <div class="select-none font-mono flex justify-between items-center">
        <div 
          class="text-grey-light text-xs font-normal hover:text-green mr-2" 
          :class="[!selected.isToday ? 'cursor-pointer': 'text-green font-bold']"
          @click="changeSelection(new Date())" 
          title="Go to today"
        >
          today
        </div>
        <div class="cursor-pointer m-1" @click="changeWeek(-1)" title="Previous Week">&lt;</div>
        <div class="cursor-pointer m-1" @click="changeWeek(1)" title="Next Week"> &gt;</div>
      </div>
    </div>
    
    <!-- Week -->
    <div class="flex justify-between mt-2 font-sans leading-loose font-medium select-none">
      <div v-for="(d,i) in week" @click="changeSelection(d.date)" :key="i" class="w-12 flex flex-col items-center justify-between cursor-pointer text-grey-darkest">
        <div class="text-grey">{{ d.day }}</div>
        <div 
          class="h-8 w-8 flex items-center justify-center text-sm font-bold rounded-full" 
          :class="[
            isSelected(d.date)? isToday(d.date)? 'text-white rounded bg-green' : 'text-white bg-green' : isToday(d.date)? 'border border-green' : '',
          ]"
        >
          {{ d.date.getDate() }}
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="mt-8">
      <div v-for="(meal, index) in selectedMeals" :key="index">
        {{meal.name}}
      </div>
    </div>
    
  </div>
</template>

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
      const { selectedDate: s } = this.$store.state
      
      const res = this.$store.state.plan.filter(p => {
        return s.getDate() == p.date.getDate() && s.getMonth() == p.date.getMonth() && s.getFullYear() == p.date.getFullYear();
      }).map(m => m.meals )
      return res[0]
    }
  }
}
</script>