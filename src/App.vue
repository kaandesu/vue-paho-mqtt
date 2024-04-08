<template>
  <main>
    <div class="wrapper">
      <section class="mqtt-fields">
        <div class="field-view">
          <div
            data-step="1"
            data-intro="Step 1: Connect or disconnect to the MQTT broker! 🔗 "
          >
            <button class="mqtt-button connect" @click="$mqtt.connect()">
              CONNECT
            </button>
            <button class="mqtt-button disconnect" @click="$mqtt.disconnect()">
              DISCONNECT
            </button>
            <span
              >MQTT status: <label> {{ $mqtt.status() }} </label></span
            >
          </div>
          <div class="hr" />
          <div
            class="settings"
            data-step="2"
            data-intro="Step 2: Configure & update the client settings! <i>(changes will apply on reconnect)</i> ⚙️"
          >
            <span class="field-row">
              <span>Host:</span>
              <input placeholder="enter mqtt host" v-model="host" />
            </span>
            <span class="field-row">
              <span>Port:</span>
              <input placeholder="enter mqtt port" v-model="port" />
            </span>
            <span class="field-row">
              <span>Path:</span>
              <input placeholder="enter mqtt path" v-model="path" />
            </span>
            <span class="field-row">
              <span>Use SSL:</span>
              <select class="optionField" v-model="useSSL">
                <option
                  :key="index"
                  v-for="(option, index) in sslOptions"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </span>
            <span class="field-row">
              <span>Username:</span>
              <input placeholder="enter mqtt username" v-model="username" />
            </span>
            <span class="field-row">
              <span>Password:</span>
              <input
                placeholder="enter mqtt password"
                v-model="password"
                type="password"
              />
            </span>
            <span class="field-row">
              <span>Main Topic:</span>
              <input placeholder="enter main mqtt topic" v-model="mainTopic" />
            </span>
            <span class="field-row">
              <span>ClientID:</span>
              <input placeholder="enter mqtt client id" v-model="clientId" />
            </span>
            <button @click="updateAll()" class="update-btn">
              Update Settings
            </button>
          </div>
          <div class="hr" />
          <div
            class="settings"
            data-step="4"
            data-intro="Step 4: Enter the topic, payload,and select the QoS mode and click publish! 📦"
          >
            <div
              style="
                font-weight: bold;
                font-size: 20px;
                margin-bottom: -15px;
                margin-top: -15px;
              "
            >
              Publish Data
            </div>
            <span>
              <input placeholder="enter publish topic" v-model="pubTopic" />
              <input placeholder="enter payload" v-model="pubData" />
            </span>
            <span class="field-row">
              <span>Publish Mode: </span>
              <select style="margin: -15px 0" v-model="pubMode">
                <option
                  v-bind:key="option.value"
                  v-for="option in options"
                  v-bind:value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
            </span>
            <button
              class="pub"
              @click="$mqtt.publish(pubTopic, pubData, pubMode as MqttMode)"
            >
              Publish
            </button>
          </div>
          <div class="hr" />
          <button class="unsub" @click="unsubAll()">Unsubscribe All</button>
          <div class="hr" />
          <span class="field-row">
            <img
              src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
              height="25"
              alt="github"
            />
            <a
              href="https://github.com/kaandesu/vue-paho-mqtt/"
              target="_blank"
              rel="noopener noreferrer"
              style="font-size: 15px; font-weight: bold"
              ><i>kaandesu/vue-paho-mqtt</i></a
            >
            <button class="help" @click="startIntro()">?</button>
          </span>
        </div>
      </section>
      <section
        class="subview"
        data-step="3"
        data-intro="Step 3: Enter a topic you want to subscribe to, and click subscribe! You can subscribe multiple topics at once! <i>On the bottom of the card you can see the data arrived!</i> 👀"
      >
        <div v-for="(card, index) in subList" :key="index" class="sub-card">
          <input placeholder="enter topic name" v-model="card.topic" />
          <div class="button-section">
            <div class="row">
              <button
                :disabled="card.topic == ''"
                @click="subscribe(card.topic, index)"
                class="btn"
              >
                Subscribe
              </button>
              <button
                :disabled="card.topic == ''"
                @click="
                  $mqtt.unsubscribe(card.topic);
                  card.subData = '---';
                "
                class="btn"
              >
                Unsubscribe
              </button>
            </div>
            <div class="sub-data">{{ card.subData }}</div>
          </div>
        </div>
      </section>
    </div>
    <div class="title">
      <img
        :class="$mqtt.status() === 'connected' ? '' : 'img-red'"
        src="/assets/logo.png"
        height="100"
        alt="Vue-Paho-Mqtt-Logo"
      />
      <h3>Vue Paho Mqtt Plugin - Live Demo</h3>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MqttMode } from '~/types/types';
// @ts-expect-error IntroJs is not typed
import introJs from 'intro.js/intro';
import 'intro.js/introjs.css';
import { $mqtt } from '~/index';
const host = ref<string>('');
const port = ref<string>('0');
const path = ref<string | undefined>(undefined);
const useSSL = ref<boolean>(false);
const clientId = ref<string>('');
const username = ref<string>('');
const password = ref<string>('');
const mainTopic = ref<string>('');
const sslOptions = ref([true, false]);
const options = ref([
  { text: 'B', value: 'B' },
  { text: 'Br', value: 'Br' },
  { text: 'Q', value: 'Q' },
  { text: 'Qr', value: 'Qr' },
  { text: 'F', value: 'F' },
  { text: 'Fnr', value: 'Fnr' },
]);
const pubTopic = ref('');
const pubData = ref('');
const pubMode = ref('B');
const subList = ref([
  { topic: '', subData: '---' },
  { topic: '', subData: '---' },
  { topic: '', subData: '---' },
  { topic: '', subData: '---' },
  { topic: '', subData: '---' },
]);

const subscribe = (topic: string, index: number) => {
  $mqtt.subscribe(topic, (data) => {
    console.log(data);
    if (typeof data === 'string') subList.value[index].subData = data;
  });
};

const updateAll = () => {
  $mqtt.host(host.value);
  $mqtt.port(parseInt(port.value));
  $mqtt.path(path.value);
  $mqtt.useSSL(useSSL.value === true);
  $mqtt.clientId(clientId.value);
  $mqtt.username(username.value);
  $mqtt.password(password.value);
  $mqtt.mainTopic(mainTopic.value);
};
const unsubAll = () => {
  $mqtt.unsubscribeAll();
  subList.value.forEach((item) => {
    item.subData = '---';
    item.topic = '';
  });
};
const startIntro = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  introJs().start();
};
onMounted(() => {
  startIntro();
  host.value = $mqtt.host();
  port.value = String($mqtt.port());
  path.value = $mqtt.path() ?? '';
  useSSL.value = $mqtt.useSSL() ?? false;
  username.value = $mqtt.username() ?? '';
  password.value = $mqtt.password() ?? '';
  mainTopic.value = $mqtt.mainTopic() ?? '';
  clientId.value = $mqtt.clientId();
});
</script>

<style scoped>
.help {
  width: 25px;
  height: 25px;
  border-radius: 100vw;
  margin-left: 10px;
  opacity: 0.7;
  border: 0;
  background: #33485e;
  color: White;
  font-weight: bold;
}

.mqtt-fields input {
  width: 100%;
  border: 0;
  outline: 0;
  background: #3fb884;
  text-align: center;
  color: white;
  margin-top: 0.25rem;
  font-size: 20px;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.hr {
  width: 100%;
  height: 1px;
  background: #33485e;
}

.pub {
  width: 50%;
  height: 40px;
  border: 0;
  outline: 0;
  background: #33485e;
  border-radius: 0.5rem;
  text-align: center;
  color: white;
  font-size: 20px;
}

.unsub {
  width: 70%;
  height: 30px;
  border: 0;
  outline: 0;
  background: #6282a3;
  border-radius: 0.5rem;
  text-align: center;
  color: white;
  font-size: 15px;
}

.mqtt-fields {
  display: block;
  flex-direction: column;
}

.field-view {
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}

.mqtt-button {
  width: 100%;
  height: 40px;
  border: 0;
  outline: 0;
  text-align: center;
  margin-top: 0.25rem;
  font-size: 20px;
  border-radius: 0.5rem;
}

.update-btn {
  background: #33485e;
  color: white;
  width: 65%;
  height: 35px;
  border-radius: 0.5rem;
}

.mqtt-button.connect {
  background: #3fb884;
  color: white;
}

.mqtt-button.disconnect {
  background: #ff9a9a;
  color: white;
}

.mqtt-fields input::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: white;
  font-weight: 100;
  font-size: 15px;
  opacity: 1;
  /* Firefox */
}

span > label {
  font-size: 17px;
  font-weight: bold;
}

.title {
  position: absolute;
  z-index: -1;
  left: 1rem;
  top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.subview {
  overflow: auto;
}

.sub-card {
  padding-top: 0.5rem;
  width: 100%;
  min-height: 80px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #33485e;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  z-index: 3;
}

.sub-card input {
  width: 90%;
  border: 0;
  outline: 0;
  background: #3fb884;
  text-align: center;
  color: white;
  margin-top: 0.25rem;
}

.sub-data {
  position: absolute;
  top: 100%;
  width: 90%;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
  transition: 0.3s ease-in-out;
  background: #33485e;
  color: white;
  z-index: -1;
  border-radius: 0px 0 0.5rem 0.5rem;
}

.sub-data::before {
  content: 'data:';
  position: absolute;
  top: 50%;
  transform: translateY(-55%);
  font-size: 10px;
  left: 0.5rem;
}

.sub-card:hover .sub-data {
  font-size: 20px;
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: white;
  font-weight: bold;
  opacity: 1;
  /* Firefox */
}

.button-section {
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60%;
  font-weight: 500;
  font-family: inherit;
  background: #3fb883;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  z-index: -2;
}

.button-section::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%);
  border-radius: 0.5rem;
  background: #33485e;
  z-index: -1;
  transform: translateY(calc(-100% + 0.2rem));
}

.row {
  width: 100%;
  height: 100%;
  flex-flow: row, nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.field-row {
  flex-flow: row, nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.1rem;
}

.button-section .btn {
  font-size: 0.8rem;
  border-radius: 8px;

  width: 50%;
  height: 50%;
  overflow: hidden;
}

.button-section .btn:nth-child(1) {
  margin-left: 0.5rem;
}

.button-section .btn:nth-child(2) {
  margin-right: 0.5rem;
}

.wrapper {
  background: var(--wrapper-color);
  padding: 0.5rem;
  border-radius: 1rem;
  min-width: 500px;
  margin-left: 10%;
  width: min(1000px, 50vw);
  height: 90vh;
  display: flex;
  gap: 0.5rem;
}

section {
  padding: 0.5rem;
  background: var(--section-color);
  border-radius: 1rem;
  width: 50%;
  height: calc(100% - 1.2rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
}

.img-red {
  transition: all 0.5s ease;
  filter: hue-rotate(214deg);
}

.optionField {
  margin: -15px 0;
  background: #3fb884;
  color: white;
  text-align: center;
  font-size: medium;
  border: none;
  width: 11rem;
  height: 1.5rem;
}
</style>
