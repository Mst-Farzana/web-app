<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import axios from 'axios';

const emit = defineEmits(['submitted', 'close']);

const previewUrl = ref('');
const imageLoadError = ref(false);
const file = ref(null);

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

const form = ref({
  category: '',
  name: '',
  details: '',
  img: '', // used if using URL
  price: '',
});

const error = ref('');
const loading = ref(false);

// Watch for img url for preview and clear file if URL is set
watch(
  () => form.value.img,
  newUrl => {
    if (newUrl) {
      file.value = null; // Clear file if URL entered
      previewUrl.value = newUrl;
      imageLoadError.value = false;
    }
  }
);

const handleFileUpload = event => {
  const uploaded = event.target.files[0];
  if (uploaded && uploaded.type.startsWith('image/')) {
    file.value = uploaded;
    previewUrl.value = URL.createObjectURL(uploaded);
    form.value.img = ''; // Clear img URL
    imageLoadError.value = false;
  } else {
    alert('Please select a valid image file');
  }
};

const submitForm = async () => {
  error.value = '';

  if (
    !form.value.category ||
    !form.value.name ||
    !form.value.details ||
    (!file.value && !form.value.img) ||
    !form.value.price
  ) {
    error.value = 'All fields are required!';
    return;
  }

  loading.value = true;

  try {
    if (file.value) {
      // If file upload
      const formData = new FormData();
      formData.append('category', form.value.category);
      formData.append('name', form.value.name);
      formData.append('details', form.value.details);
      formData.append('img', file.value);
      formData.append('price', form.value.price);

      await axios.post(
        'http://localhost:5000/api/categoryItems/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } else {
      // If using URL
      await axios.post('http://localhost:5000/api/categoryItems', {
        category: form.value.category,
        name: form.value.name,
        details: form.value.details,
        img: form.value.img, // should be a valid URL
        price: Number(form.value.price),
      });
    }

    // Emit submitted event with category so parent can update list
    emit('submitted', form.value.category);

    // Reset form
    form.value = {
      category: '',
      name: '',
      details: '',
      img: '',
      price: '',
    };
    previewUrl.value = '';
    file.value = null;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to add product';
  } finally {
    loading.value = false;
  }
};

// Clean up created object URLs on unmount to avoid memory leaks
onBeforeUnmount(() => {
  if (previewUrl.value && file.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <div class="max-w-md mx-auto p-6 border rounded shadow bg-white mt-10">
    <h3 class="text-xl font-bold mb-4">Add New Product</h3>

    <div class="mb-3">
      <label class="block mb-1 font-semibold">Select Category</label>
      <select v-model="form.category" class="w-full border rounded p-2">
        <option value="" disabled>Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label class="block mb-1 font-semibold">Product Name</label>
      <input
        v-model="form.name"
        type="text"
        class="w-full border rounded p-2"
        placeholder="Enter product name"
      />
    </div>

    <div class="mb-3">
      <label class="block mb-1 font-semibold">Product Details</label>
      <textarea
        v-model="form.details"
        class="w-full border rounded p-2"
        rows="3"
      ></textarea>
    </div>

    <!-- File Upload -->
    <div class="mb-3">
      <label class="block mb-1 font-semibold">Upload Image (from device)</label>
      <input type="file" accept="image/*" @change="handleFileUpload" />
    </div>

    <!-- OR URL -->
    <div class="mb-3">
      <label class="block mb-1 font-semibold">Or Enter Image URL</label>
      <input
        v-model="form.img"
        type="url"
        class="w-full border rounded p-2"
        placeholder="https://example.com/image.jpg"
      />
    </div>

    <!-- Preview -->
    <div v-if="previewUrl" class="mb-3">
      <img
        :src="previewUrl"
        @error="imageLoadError = true"
        class="w-32 h-32 object-cover border"
      />
      <p v-if="imageLoadError" class="text-red-500 text-sm mt-1">
        ❌ Image failed to load. Please check the URL.
      </p>
    </div>

    <div class="mb-3">
      <label class="block mb-1 font-semibold">Price (৳)</label>
      <input
        v-model="form.price"
        type="number"
        class="w-full border rounded p-2"
        min="0"
      />
    </div>

    <div v-if="error" class="mb-3 text-red-600 font-semibold">{{ error }}</div>

    <div class="flex justify-between items-center">
      <button
        @click="submitForm"
        :disabled="loading"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Submitting...' : 'Submit' }}
      </button>

      <button @click="$emit('close')" class="text-gray-600 hover:text-gray-900">
        Cancel
      </button>
    </div>
  </div>
</template>
