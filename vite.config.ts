import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'live-demo') {
    return {
      base: '/vue-paho-mqtt/',
      plugins: [vue()],
      test: {
        globals: true,
      },
    };
  } else {
    return {
      plugins: [vue()],
      test: {
        globals: true,
        setupFiles: 'src/setupTests.ts',
        includeSource: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
      },
      build: {
        lib: {
          entry: resolve(__dirname, 'src/pahoMqttPlugin/index.ts'),
          name: 'VuePahoMqtt',
          fileName: 'vue-paho-mqtt',
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
        },
      },
    };
  }
});
