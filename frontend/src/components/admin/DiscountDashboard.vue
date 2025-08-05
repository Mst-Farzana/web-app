<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// ✅ Get admin token from localStorage
const adminToken = localStorage.getItem('adminToken') || '';

// ✅ Correct backend base URL for dev and production
const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://shopease-production.up.railway.app';

const discounts = ref([]);
const form = ref({ name: '', offer: '', img: '', _id: null });
const isEditing = ref(false);
const loading = ref(false);

// ✅ Fetch all discounts
const fetchDiscounts = async () => {
  try {
    const { data } = await axios.get(`${baseURL}/api/discounts`);
    discounts.value = data;
  } catch (err) {
    alert('Failed to fetch discounts');
  }
};

// ✅ Create new discount
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

// ✅ Update existing discount
const updateDiscount = async () => {
  if (!form.value._id) {
    console.error('❌ No ID provided for update');
    return;
  }

  loading.value = true;
  try {
    console.log('📤 Sending update request:', {
      id: form.value._id,
      name: form.value.name,
      offer: form.value.offer,
      img: form.value.img,
    });

    const response = await axios.put(
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

    console.log('✅ Update success:', response.data);

    resetForm();
    fetchDiscounts();
  } catch (err) {
    console.error('❌ Update error:', err?.response?.data || err.message);
    alert('Failed to update discount');
  } finally {
    loading.value = false;
  }
};

// ✅ Delete a discount
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

// ✅ Load discount into form for editing
const editDiscount = item => {
  form.value = { ...item };
  isEditing.value = true;
};

// ✅ Reset form
const resetForm = () => {
  form.value = { name: '', offer: '', img: '', _id: null };
  isEditing.value = false;
};

// ✅ Initial load
onMounted(() => {
  fetchDiscounts();
});
</script>
