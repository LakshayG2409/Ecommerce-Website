import React from 'react'
import "./Admin.css"
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import AdminOrders from '../../Components/AdminOrders/AdminOrders'
import HeroProduct from '../../Components/HeroProduct/HeroProduct'


const Admin = () => {
  return (
    <div className='admin'>
        <Sidebar/>
        <Routes>
            <Route path='/addproduct' element={<AddProduct/>}/>
            <Route path='/listproduct' element={<ListProduct/>}/>
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/best-sellers" element={<HeroProduct />} />
        </Routes>
      
    </div>
  )
}

export default Admin
