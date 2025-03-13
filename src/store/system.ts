import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
  state: () => {
    return { theme: 'light' };
  },
  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },
  },
});
