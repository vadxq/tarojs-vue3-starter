import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0, selected: 0 };
  },
  actions: {
    increment() {
      this.count++;
    },
    setSelected(index: number) {
      this.selected = index;
    },
  },
});
