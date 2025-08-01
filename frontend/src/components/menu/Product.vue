<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import OrderForm from '../order/OrderForm.vue';
import OrderList from '../order/AdminOrderList.vue'; // ✅ Correct
import emitter from '../../eventBus'; // Event bus import

const showOrders = ref(false);

function toggleOrders() {
  showOrders.value = !showOrders.value;
}

const selectedProduct = ref(null);
const items = ref([]);
const loading = ref(false);
const error = ref('');
const showForm = ref(false); // toggle for showing OrderList now

// Delete item function with refresh & emit event
const deleteItem = async id => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  try {
    await axios.delete(`http://localhost:5000/api/categoryItems/${id}`);
    refreshItems();
    emitter.emit('productsUpdated'); // Emit event after delete
  } catch (err) {
    alert('Failed to delete item');
    console.error(err);
  }
};

// Edit form reactive and functions
const showEditForm = ref(false);
const editProduct = ref({
  _id: '',
  name: '',
  details: '',
  price: 0,
  img: '',
  category: '',
});

// Open edit modal with product data
const editItem = item => {
  editProduct.value = { ...item };
  showEditForm.value = true;
};

// Submit edited product and refresh list + emit event
const submitEdit = async () => {
  try {
    await axios.put(
      `http://localhost:5000/api/categoryItems/${editProduct.value._id}`,
      editProduct.value
    );
    showEditForm.value = false;
    refreshItems();
    emitter.emit('productsUpdated'); // Emit event after edit
  } catch (err) {
    alert('Failed to update item');
    console.error(err);
  }
};

const closeEditForm = () => {
  showEditForm.value = false;
};

const handleOrder = product => {
  selectedProduct.value = product;
};

const refreshItems = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await axios.get('http://localhost:5000/api/categoryItems');
    items.value = res.data;
  } catch (err) {
    error.value = 'Failed to fetch items';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const containerRef = ref(null);

const onClickOutside = event => {
  if (
    selectedProduct.value &&
    containerRef.value &&
    !containerRef.value.contains(event.target)
  ) {
    selectedProduct.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
  refreshItems(); // fetch on mount
  emitter.on('productsUpdated', refreshItems); // Listen to event
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  emitter.off('productsUpdated'); // Remove listener on unmount
});
</script>

<template>
  <div ref="containerRef" class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">All Products</h2>
      <button
        @click="showForm = !showForm"
        class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        {{ showForm ? 'Close' : 'Manage Orders' }}
      </button>
    </div>

    <div v-if="showForm">
      <OrderList />
    </div>

    <div v-if="loading" class="mt-6 text-gray-700">Loading items...</div>

    <div v-if="error" class="mt-6 text-red-600">{{ error }}</div>

    <div
      v-if="items.length && !showForm"
      class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <div
        v-for="item in items"
        :key="item._id"
        class="border p-4 rounded shadow hover:shadow-lg transition"
      >
        <img
          :src="
            item.img.startsWith('http')
              ? item.img
              : item.img.startsWith('/uploads/')
              ? `http://localhost:5000${item.img}`
              : `http://localhost:5000/images/${
                  item.img.startsWith('/') ? item.img.slice(1) : item.img
                }`
          "
          alt="Product Image"
        />

        <h3 class="mt-2 font-semibold">{{ item.name }}</h3>
        <p class="text-sm text-gray-600">{{ item.details }}</p>
        <p class="mt-1 font-bold">Price: ৳{{ item.price }}</p>

        <button
          @click.stop="handleOrder(item)"
          class="bg-green-600 text-white px-3 py-1 mt-2 rounded hover:bg-green-400"
        >
          Order Now
        </button>

        <!-- Edit/Delete buttons -->
        <div class="flex space-x-2 mt-2">
          <button
            @click="editItem(item)"
            class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            ✏️ Edit
          </button>
          <button
            @click="deleteItem(item._id)"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            🗑️ Delete
          </button>
        </div>

        <OrderForm
          v-if="selectedProduct && selectedProduct._id === item._id"
          :product="selectedProduct"
          @close="selectedProduct = null"
        />
      </div>
    </div>

    <div
      v-if="!items.length && !loading && !showForm"
      class="mt-6 text-gray-500"
    >
      No products found.
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Edit Product</h3>

        <label class="block mb-2">
          Name:
          <input
            v-model="editProduct.name"
            type="text"
            class="w-full border rounded px-2 py-1"
          />
        </label>

        <label class="block mb-2">
          Details:
          <textarea
            v-model="editProduct.details"
            class="w-full border rounded px-2 py-1"
          ></textarea>
        </label>

        <label class="block mb-2">
          Price:
          <input
            v-model.number="editProduct.price"
            type="number"
            min="0"
            class="w-full border rounded px-2 py-1"
          />
        </label>

        <label class="block mb-2">
          Image URL:
          <input
            v-model="editProduct.img"
            type="text"
            class="w-full border rounded px-2 py-1"
          />
        </label>

        <label class="block mb-4">
          Category:
          <select
            v-model="editProduct.category"
            class="w-full border rounded px-2 py-1"
          >
            <option
              v-for="cat in [
                'Dress',
                'Cosmetics',
                'Jewelry',
                'Bag',
                'Watch',
                'Phone',
                'Kids Item',
                'Shoe',
              ]"
              :key="cat"
              :value="cat"
            >
              {{ cat }}
            </option>
          </select>
        </label>

        <div class="flex justify-end space-x-2">
          <button
            @click="closeEditForm"
            class="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="submitEdit"
            class="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
