import { createRouter, createWebHashHistory } from 'vue-router';
import { isAdminLoggedIn } from '../stores/adminAuth';

// User/Auth Pages
import Home from '../components/page/Home.vue';
import Login from '../components/logSign/Login.vue';
import Signup from '../components/logSign/Signup.vue';
import NotFound from '../components/routes-err/NotFound.vue';
import AdminLogin from '../components/admin/UseradminLogin.vue';

// Admin Discount Pages
import DiscountManager from '../components/admin/DiscountManager.vue';
import ProductList from '../components/admin/discount/ProductList.vue';
import AddProductForm from '../components/admin/discount/AddProductForm.vue';
import AddParcentage from '../components/admin/discount/AddParcentage.vue';

// Other Menu Pages (optional)
import Category from '../components/menu/Category.vue';
import Contact from '../components/menu/Contact.vue';
import Product from '../components/menu/Product.vue';
import Service from '../components/menu/Service.vue';
import Agent from '../components/menu/Agent.vue';
import Add from '../components/menu/Add.vue';

const routes = [
  { path: '/', redirect: '/home' },

  { path: '/useradminlogin', name: 'AdminLogin', component: AdminLogin },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },

  {
    path: '/home',
    name: 'Home',
    component: Home, // ✅ Public
  },

  {
    path: '/discounts',
    component: DiscountManager,
    meta: { requiresAuth: true }, // 🔒 Admin only
    children: [
      { path: '', redirect: 'items' },
      { path: 'items', component: ProductList },
      { path: 'add', component: AddProductForm },
      { path: 'parcentage', component: AddParcentage },
    ],
  },

  { path: '/category', component: Category, meta: { requiresAuth: true } }, // 🔒
  { path: '/contact', component: Contact },
  { path: '/product', component: Product, meta: { requiresAuth: true } }, // 🔒
  { path: '/service', component: Service },
  { path: '/agent', component: Agent, meta: { requiresAuth: true } }, // 🔒
  { path: '/add', component: Add, meta: { requiresAuth: true } }, // 🔒

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHashHistory('/web-app/'),
  routes,
});

// Global navigation guard for auth check
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAdminLoggedIn.value) {
    next({ path: '/useradminlogin', query: { redirect: to.fullPath } });
  } else if (to.path === '/useradminlogin' && isAdminLoggedIn.value) {
    next('/home');
  } else {
    next();
  }
});

export default router;
