import App from '../App.jsx';
import { createHashRouter } from "react-router-dom";
import Home from '../pages/Home.jsx';
import Product from '../pages/Product.jsx';
import Custom from '../pages/Custom.jsx';
import About from '../pages/About.jsx';


const routes = [
    {
        path: '/',
        element: <App/>,
        children:[
        {
            index: true,
            element: <Home/> 
        },
        {
            path:'product',
            element: <Product/> ,
        },
        {
            path:'about',
            element: <About/> ,
        },
        {
            path:'custom',
            element: <Custom/> ,
        },
        // {
        //     path:'*',
        //     element: <NotFound/>
        // }
        ]
    },
]


const router = createHashRouter(routes);

export default router;