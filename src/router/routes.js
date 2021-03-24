
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/login.vue') },
      { path: '/changePassword', component: () => import('pages/ChangePassword.vue') },
      { path: '/verification', component: () => import('pages/Verification.vue') },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/orderpage', component: () => import('pages/OrderPage.vue') },
      { path: '/mainPage', component: () => import('pages/MainPage.vue') },
      { path: '/saleOrder', component: () => import('pages/SaleOrder.vue') },
      { path: '/products', component: () => import('pages/Products.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
