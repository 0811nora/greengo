import App from '../App.jsx';
import { createHashRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Product from '../pages/Product.jsx';
import Custom from '../pages/Custom.jsx';
import About from '../pages/About.jsx';
import Article from '../pages/Article.jsx';
import Cart from '../pages/Cart.jsx';
import Checkout from '../pages/Checkout.jsx';
import ArticleDetail from '../pages/ArticleDetail.jsx';
import Member from '../pages/member.jsx';

import AdminPages from '../pages/admin/AdminPages.jsx';
import AdminHome from '../pages/admin/AdminHome.jsx';
import AdminBlog from '../pages/admin/AdminBlog.jsx';
import AdminOrder from '../pages/admin/AdminOrder.jsx';
import AdminReport from '../pages/admin/AdminReport.jsx';
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import AdminProducts from '../pages/admin/AdminProducts.jsx';
import AdminOrder_today from '../pages/admin/AdminOrder_today.jsx';
import AdminOrder_history from '../pages/admin/AdminOrder_history.jsx';
import { Product2 } from '../pages/Product2.jsx';
import AdminUpload from '../pages/admin/AdminUpload.jsx';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'product', element: <Product /> },
      { path: 'product2', element: <Product2 /> },
      { path: 'about', element: <About /> },
      { path: 'custom', element: <Custom /> },
      { path: 'article', element: <Article /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'article/:id', element: <ArticleDetail /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminPages />,
    children: [
      { index: true, element: <Navigate to="order" replace /> },
      {
        path: 'order',
        element: <AdminOrder />,
        children: [
          {
            index: true,
            element: <Navigate to="today" replace />,
          },
          { path: 'today', element: <AdminOrder_today /> },
          { path: 'history', element: <AdminOrder_history /> },
        ],
      },
      { path: 'products', element: <AdminProducts /> },
      { path: 'blog', element: <AdminBlog /> },
      { path: 'report', element: <AdminReport /> },
      { path: 'upload', element: <AdminUpload /> },
    ],
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // }
];

const router = createHashRouter(routes);

export default router;
