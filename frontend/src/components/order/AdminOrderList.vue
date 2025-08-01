<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const loading = ref(true);
const error = ref('');

const fetchOrders = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/orders');
    orders.value = res.data;
  } catch (err) {
    error.value = 'Failed to load orders';
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (orderId, newStatus) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/orders/${orderId}/status`,
      {
        status: newStatus,
      }
    );
    // Update local list to reflect change
    const order = orders.value.find(o => o._id === orderId);
    if (order) order.status = newStatus;

    // Show alert based on email send status from backend
    if (res.data.emailSent) {
      alert('✅ Status updated and confirmation email sent.');
    } else {
      alert('⚠️ Status updated but failed to send confirmation email.');
    }
  } catch {
    alert('Failed to update status');
  }
};

const deleteOrder = async orderId => {
  if (!confirm('Are you sure you want to delete this order?')) return;

  try {
    await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
    orders.value = orders.value.filter(o => o._id !== orderId);
  } catch {
    alert('Failed to delete order');
  }
};

onMounted(fetchOrders);
</script>

<template>
  <div class="text-[10px]">
    <h2 class="text-2xl font-bold mb-4">Orders List</h2>

    <div v-if="loading">Loading orders...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <table v-else class="w-full border-collapse border border-gray-300">
      <thead class="bg-gray-200">
        <tr>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Phone</th>
          <th class="border px-4 py-2">Product</th>
          <th class="border px-4 py-2">Qty</th>
          <th class="border px-4 py-2">Delivery</th>
          <th class="border px-4 py-2">Total</th>
          <th class="border px-4 py-2">Payment</th>
          <th class="border px-4 py-2">Status</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id" class="hover:bg-gray-50">
          <td class="border px-4 py-2">{{ order.customerName }}</td>
          <td class="border px-4 py-2">{{ order.phone }}</td>
          <td class="border px-4 py-2">{{ order.productName }}</td>
          <td class="border px-4 py-2">{{ order.quantity }}</td>
          <td class="border px-4 py-2">
            {{ order.deliveryOption }} (৳{{ order.deliveryCharge }})
          </td>
          <td class="border px-4 py-2">৳{{ order.totalPrice }}</td>
          <td class="border px-4 py-2">{{ order.paymentMethod }}</td>
          <td class="border px-4 py-2 capitalize">{{ order.status }}</td>
          <td class="border px-4 py-2 space-x-1">
            <select
              v-model="order.status"
              @change="updateStatus(order._id, order.status)"
              class="border p-1 rounded"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              @click="deleteOrder(order._id)"
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
