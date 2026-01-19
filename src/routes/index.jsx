import App from "../App.jsx";
import { createHashRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Product from "../pages/Product.jsx";
import Custom from "../pages/Custom.jsx";
import About from "../pages/About.jsx";
import Article from "../pages/Article.jsx";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import AdminPages from "../pages/admin/AdminPages.jsx";
import AdminHome from "../pages/admin/AdminHome.jsx";
import AdminBlog from "../pages/admin/AdminBlog.jsx";
import AdminOrder from "../pages/admin/AdminOrder.jsx";
import AdminReport from "../pages/admin/AdminReport.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminStock from "../pages/admin/AdminStock.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "product", element: <Product /> },
      { path: "about", element: <About /> },
      { path: "custom", element: <Custom /> },
      { path: "article", element: <Article /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminPages />,
    // element: <AdminOrder /> ,
    children: [
      { index: true, element: <AdminHome /> },
      // { index: true, element: <AdminOrder /> },
      // { index: true, element: <Navigate to="/admin/order" replace /> },
      { path: "order", element: <AdminOrder /> },
      { path: "stock", element: <AdminStock /> },
      { path: "blog", element: <AdminBlog /> },
      { path: "report", element: <AdminReport /> },
    ],
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // }
];

const router = createHashRouter(routes);

export default router;
