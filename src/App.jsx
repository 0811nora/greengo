import axios from 'axios'; 
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';


function App() {

  // 這一段是為了確認，載入axios套件有成功，可以刪除
  useEffect(()=>{
    (async () =>{
      const res = await axios.get('https://randomuser.me/api')
      console.log(res)
    })
  })

  return (
    <>
      <div className='App'>
        <Header/>
        <div className='main'>
          <Outlet/>
        </div>
        <Footer/>
      </div>




    </>
  )
}

export default App
