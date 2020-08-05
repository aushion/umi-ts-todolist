import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  theme: {
    '@primary-color': '#1DA57A',
  },
  define:{
    'process.env.apiUrl': 'http://localhost:7001'
  },
  // layout: {},
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
});
