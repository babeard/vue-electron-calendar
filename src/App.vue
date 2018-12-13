<template>
  <div id="app" style="-webkit-app-region: drag" class="flex min-h-screen">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <div class="w-64 p-4 bg-grey-darker text-white shadow-lg fixed min-h-screen">
      This is the sidebar
    </div>
    <router-view/>
  </div>
</template>

<style src="./assets/main.css">
