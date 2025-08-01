<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import OrderForm from '../order/OrderForm.vue';
import AddProduct from '../menu/Add.vue';
import emitter from '../../eventBus';

const selectedCategory = ref(null);
const selectedProduct = ref(null);
const items = ref([]);
const loading = ref(false);
const error = ref('');
const showForm = ref(false);

const showEditForm = ref(false);
const editProduct = ref({
  _id: '',
  name: '',
  details: '',
  price: 0,
  img: '',
  category: '',
});

const categories = [
  'Dress',
  'Cosmetics',
  'Jewelry',
  'Bag',
  'Watch',
  'Phone',
  'Kids Item',
  'Shoe',
];

// ✅ Select category
const selectCategory = category => {
  selectedProduct.value = null;
  selectedCategory.value = category;
};

// ✅ Refresh items by category
const refreshItems = async () => {
  if (!selectedCategory.value) return;
  loading.value = true;
  error.value = '';
  try {
    const res = await axios.get(
      `http://localhost:5000/api/categoryItems/${encodeURIComponent(
        selectedCategory.value
      )}`
    );
    items.value = res.data;
  } catch (err) {
    error.value = 'Failed to fetch items';
    items.value = [];
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// ✅ Watch category change
watch(selectedCategory, () => {
  refreshItems();
});

// ✅ On new product submit
const onAddProductSubmitted = category => {
  if (selectedCategory.value !== category) {
    selectedCategory.value = category; // triggers watch
  } else {
    refreshItems(); // same category, manually refresh
  }
  showForm.value = false;
  emitter.emit('productsUpdated');
};

// ✅ Delete
const deleteItem = async id => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  try {
    await axios.delete(`http://localhost:5000/api/categoryItems/${id}`);
    refreshItems();
    emitter.emit('productsUpdated');
  } catch (err) {
    alert('Failed to delete item');
    console.error(err);
  }
};

// ✅ Edit
const editItem = item => {
  editProduct.value = { ...item };
  showEditForm.value = true;
};

const submitEdit = async () => {
  try {
    await axios.put(
      `http://localhost:5000/api/categoryItems/${editProduct.value._id}`,
      editProduct.value
    );

    showEditForm.value = false;

    // If category changed during edit, update selectedCategory to trigger refreshItems
    if (selectedCategory.value !== editProduct.value.category) {
      selectedCategory.value = editProduct.value.category;
    } else {
      refreshItems();
    }

    emitter.emit('productsUpdated');
  } catch (err) {
    alert('Failed to update item');
    console.error(err);
  }
};

const closeEditForm = () => {
  showEditForm.value = false;
};

// ✅ Click outside handler
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

// ✅ Mount/unmount
onMounted(() => {
  document.addEventListener('click', onClickOutside);
  emitter.on('productsUpdated', refreshItems);

  // Set default category on mount if none selected
  if (!selectedCategory.value && categories.length > 0) {
    selectedCategory.value = categories[0];
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  emitter.off('productsUpdated', refreshItems);
});
</script>

<template>
  <div ref="containerRef" class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Select a Category</h2>
      <button
        @click="showForm = !showForm"
        class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        {{ showForm ? 'Close' : '➕ New' }}
      </button>
    </div>

    <!-- ✅ Add Product Form -->
    <AddProduct
      v-if="showForm"
      @submitted="onAddProductSubmitted"
      @close="showForm = false"
    />

    <!-- ✅ Category Buttons -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <button
        v-for="(category, index) in categories"
        :key="index"
        @click="selectCategory(category)"
        :class="[
          'px-4 py-2 rounded-lg shadow text-white',
          selectedCategory === category
            ? 'bg-blue-700'
            : 'bg-blue-500 hover:bg-blue-600',
          'cursor-pointer',
        ]"
      >
        {{ category }}
      </button>
    </div>

    <div v-if="loading" class="mt-6 text-gray-700">Loading items...</div>
    <div v-if="error" class="mt-6 text-red-600">{{ error }}</div>

    <!-- ✅ Product Cards -->
    <div
      v-if="items.length"
      class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 h-auto w-auto"
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
          class="w-auto max-w-full h-auto"
        />
        <h3 class="mt-2 font-semibold">{{ item.name }}</h3>
        <p class="text-sm text-gray-600">{{ item.details }}</p>
        <p class="mt-1 font-bold">Price: ৳{{ item.price }}</p>

        <button
          @click.stop="selectedProduct = item"
          class="bg-green-600 text-white px-3 py-1 mt-2 rounded hover:bg-green-400"
        >
          Order Now
        </button>

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
      v-if="!items.length && !loading && selectedCategory"
      class="mt-6 text-gray-500"
    >
      No items found for "{{ selectedCategory }}"
    </div>

    <!-- ✅ Edit Modal -->
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
            <option v-for="cat in categories" :key="cat" :value="cat">
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
