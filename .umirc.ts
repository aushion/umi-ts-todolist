import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  base: '/todolist',
  theme: {
    '@primary-color': '#1DA57A',
  },
  define:{
    'process.env.apiUrl': 'http://49.232.149.175:7001'
  },
  // layout: {},
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
});
