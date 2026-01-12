import App from "../App.jsx";
import { createHashRouter } from "react-router-dom";
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

// const routes = [
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//       {
//         path: "product",
//         element: <Product />,
//       },
//       {
//         path: "about",
//         element: <About />,
//       },
//       {
//         path: "custom",
//         element: <Custom />,
//       },
//       {
//         path: "admin",
//         element: <AdminPages />,
//         children: [
//           {
//             index: true,
//             element: <AdminHome />,
//           },
//           {
//             path: "order",
//             element: <AdminOrder />,
//           },
//           {
//             path: "blog",
//             element: <AdminBlog />,
//           },
//         ],
//       },

//       // {
//       //   path:'*',
//       //   element: <NotFound/>
//       // }
//     ],
//   },
// ];

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
    path: "/admin",
    element: <AdminPages />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: "order", element: <AdminOrder /> },
      { path: "blog", element: <AdminBlog /> },
    ],
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // }
];

const router = createHashRouter(routes);

export default router;
