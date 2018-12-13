<template>
  <div class="bg-grey-lighter p-10 pb-1 text-black flex-1 ml-64">
    <week />
  </div>
</template>

<script>
// @ is an alias to /src

import Week from "@/components/Week.vue";

export default {
  name: "summary",
  components: {
    Week
  }
};
</script>
