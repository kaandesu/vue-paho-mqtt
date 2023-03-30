
<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <button @click="onClick()"> click me!</button>
    <button @click="onClick2()"> dont click me!</button>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { getCurrentInstance, onMounted } from 'vue';
const { $connect, $disconnect, $mqtt }: any = getCurrentInstance()?.appContext.config.globalProperties;
onMounted(() => {
  
  $mqtt.subscribe('arm', (data:any) => {
    console.log(data,'it worked!??')
  },false);
  
  
})
const onClick = () => {
  $mqtt.connect();
}
const onClick2 = () => {
 $mqtt.publish('arm', `hello world ${Math.round(Math.random() * 10)}`,'B',false);
 // $disconnect();
}
</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
