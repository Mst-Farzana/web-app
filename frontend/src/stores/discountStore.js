import { defineStore } from 'pinia';
import axios from 'axios';

export const useDiscountStore = defineStore('discountStore', {
  state: () => ({
    discounts: [],
  }),
  actions: {
    async fetchDiscounts() {
      try {
        const res = await axios.get(
          'https://web-app-production.up.railway.app/api/discounts',
          {
            withCredentials: false,
          }
        );

        this.discounts = res.data;
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    },
  },
});
