
<template>
  <div>
    
    <button @click="connect()"> connect</button>
    <button @click="subscribe()"> subscribe to arm</button>
    <button @click="disconnect()"> disconnect</button>
    <button @click="publish()"> publish</button>    
    
    <label for="host">Host</label>
    <input id="host" placeholder="Host" v-model="host" />

    <label for="port">Port</label>
    <input id="port" placeholder="Port" v-model="port" />

    <label for="clientId">Client ID</label>
    <input id="clientId" placeholder="ClientId" v-model="clientId" />

    <label for="mainTopic">Main Topic</label>
    <input id="mainTopic" placeholder="MainTopic" v-model="mainTopic" />
    <button @click="changeSettings()"> Change Settings</button>

    <h3>status: {{ $status }}</h3>
    <button @click="showClient()"> Log Client</button>
  </div>

</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, inject } from 'vue';

const { $mqtt, $status, $showClient }: any = getCurrentInstance()?.appContext.config.globalProperties;

const port = ref('9001');
const host = ref('localhost');
const mainTopic = ref('ADT');
const clientId = ref('zort');

onMounted(() => {
  $mqtt.subscribe('arm', (data:any) => {
    console.log(data,'it worked!??')
  },false);

  $mqtt.subscribe('mob', (data:any) => {
    console.log(data,'MOBDATA')
  },false);
 console.log($status);
});

const connect = () => {  
  $mqtt.connect({
    onConnect: () => {
      console.log('zaaart');
    },
    onFailure: () => {
      console.log('zoooooooooooooooort');
    },
  });  
};

const subscribe = () => {
  $mqtt.subscribe('arm', (data:any) => {
    console.log(data,'it worked!??')
  });
};

const disconnect = () => {
  $mqtt.disconnect();
};

const publish = () => {
  $mqtt.publish('arm', `hello world ${Math.round(Math.random() * 10)}`, 'B');
};

onMounted(() => {
  // console.log($mqtt.status);
});

const changeSettings = () => {
  changePort();
  changeHost();
  changeClientId();
  changeMainTopic();
}

const changePort = () => {
  $mqtt.port(parseInt(port.value));
}

const changeHost = () => {
  $mqtt.host(host.value);
}

const changeClientId = () => {
  $mqtt.clientId(clientId.value);
}

const changeMainTopic = () => {
  $mqtt.mainTopic(mainTopic.value);
}

const showClient = () => {
  $showClient();
}
</script>

<style scoped>
div{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap:1rem;
  height: 100vh;  
}

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
