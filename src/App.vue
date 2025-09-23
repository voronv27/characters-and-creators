<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>
 <!--     <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>-->
<!-- RouterView-->
<template>
  <h1>Characters and Creators</h1>
<div class="section">asdf</div>
</template>

<style scoped>
  :root{
  --fg: rgb(255, 50, 70);
  --fg-text: rgb(255, 255, 255);
}
* {
  font-family: arial;
}
html, body{
  background-color: white;
}

header{

}

nav{
  display: flex;
  flex-direction: row;
  position: sticky;
}

h1{
  text-align: center;
}

nav > a{
  background-color: var(--fg);
  color: var(--fg-text);
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
}

span.title{
  flex-grow: 1;
  text-align: center;
  font-size: 2em;
}



</style>
