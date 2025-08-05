import { defineStore } from 'pinia';
import axios from 'axios';

export const useDiscountStore = defineStore('discountStore', {
  state: () => ({
    discounts: [],
  }),
  actions: {
    async fetchDiscounts() {
      try {
        const res = await axios.get('http://localhost:5000/api/discounts');
        console.log(res.data);
        this.discounts = res.data;
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    },
  },
});
