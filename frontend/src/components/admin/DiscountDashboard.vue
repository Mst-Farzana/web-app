<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const adminToken = localStorage.getItem('adminToken') || '';

// ✅ Use correct backend URL for both local + GitHub Pages
const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://web-app-productions.up.railway.app';

const discounts = ref([]);
const form = ref({ name: '', offer: '', img: '', _id: null });
const isEditing = ref(false);
const loading = ref(false);

const fetchDiscounts = async () => {
  try {
    const { data } = await axios.get(`${baseURL}/api/discounts`);
    discounts.value = data;
  } catch (err) {
    alert('Failed to fetch discounts');
  }
};

const createDiscount = async () => {
  if (!form.value.name || !form.value.offer) {
    alert('Please fill name and offer');
    return;
  }
  loading.value = true;
  try {
    await axios.post(
      `${baseURL}/api/discounts`,
      {
        name: form.value.name,
        offer: form.value.offer,
        img: form.value.img,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    resetForm();
    fetchDiscounts();
  } catch (err) {
    alert('Failed to add discount');
  } finally {
    loading.value = false;
  }
};

const updateDiscount = async () => {
  if (!form.value._id) return;
  loading.value = true;
  try {
    await axios.put(
      `${baseURL}/api/discounts/${form.value._id}`,
      {
        name: form.value.name,
        offer: form.value.offer,
        img: form.value.img,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    resetForm();
    fetchDiscounts();
  } catch (err) {
    alert('Failed to update discount');
  } finally {
    loading.value = false;
  }
};

const deleteDiscount = async id => {
  if (!confirm('Are you sure?')) return;
  loading.value = true;
  try {
    await axios.delete(`${baseURL}/api/discounts/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    fetchDiscounts();
  } catch (err) {
    alert('Failed to delete discount');
  } finally {
    loading.value = false;
  }
};

const editDiscount = item => {
  form.value = { ...item };
  isEditing.value = true;
};

const resetForm = () => {
  form.value = { name: '', offer: '', img: '', _id: null };
  isEditing.value = false;
};

onMounted(() => {
  fetchDiscounts();
});
</script>
