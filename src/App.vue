<template>
  <div :class="$mqtt.status()">
    <label>mqtt status: {{ $mqtt.status() }}</label>
    <button @click="connect()">connect</button>
    <button @click="subscribe()">subscribe to arm</button>
    <button @click="unsubscribe('arm')">Unsubscribe from all</button>
    <button @click="disconnect()">disconnect</button>
    <button @click="publish()">publish</button>

    <label for="host">Host</label>
    <input id="host" placeholder="Host" v-model="host" />

    <label for="port">Port</label>
    <input id="port" placeholder="Port" v-model="port" />

    <label for="clientId">Client ID</label>
    <input id="clientId" placeholder="ClientId" v-model="clientId" />

    <label for="mainTopic">Main Topic</label>
    <input id="mainTopic" placeholder="MainTopic" v-model="mainTopic" />
    <button @click="changeSettings()">Change Settings</button>
    <h4>subData: {{ subData }}</h4>
    <button @click="showClient()">Log Client</button>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue';

const { $mqtt, $showClient }: any =
  getCurrentInstance()?.appContext.config.globalProperties;

const port = ref('9001');
const host = ref('localhost');
const mainTopic = ref('ADT');
const clientId = ref('zort');

onMounted(() => {
  console.log($mqtt.host());
  $mqtt.subscribe('arm', (data: any) => {
    console.log(data, 'it worked!??');
  });

  $mqtt.subscribe('mob', (data: any) => {
    console.log(data, 'MOBDATA');
  });
  console.log($mqtt.status());
});

const connect = () => {
  $mqtt.connect({
    onConnect: () => {
      console.log('Mqtt connected (custom callback))');
    },
    onFailure: () => {
      console.log('Mqtt failed to connect (custom callback))');
    },
  });
};
const unsubscribe = (topic: string) => {
  $mqtt.unsubscribeAll();
};
const subData = ref('no data yet');
const subscribe = () => {
  $mqtt.subscribe('arm', (data: any) => {
    console.log(data, 'ARMDATA2');
    subData.value = data;
  });
  $mqtt.subscribe('mob', (data: any) => {
    console.log(data, 'MOBDATA2');
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
};

const changePort = () => {
  $mqtt.port(parseInt(port.value));
};

const changeHost = () => {
  $mqtt.host(host.value);
};

const changeClientId = () => {
  $mqtt.clientId(clientId.value);
};

const changeMainTopic = () => {
  $mqtt.mainTopic(mainTopic.value);
};

const showClient = () => {
  $showClient();
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
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
.connected {
  background-color: rgba(0, 224, 0, 0.82);
}
.disconnected {
  background-color: rgba(255, 0, 0, 0.522);
}
label,
h4 {
  margin: -0.5rem 0;
}
</style>
