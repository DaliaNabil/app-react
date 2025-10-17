import React from 'react'

import { Outlet } from 'react-router-dom';
import {FooterComponent} from './../Footer/Footer';
import { NavbarComponent } from '../NavbarComponent/NavbarComponent';

export default function Layout() {
  return (
    <div className='flex min-h-screen flex-col justify-between'>
      <NavbarComponent/>
      <div className='flex-grow-1'>
        <Outlet/>
        </div>
      <FooterComponent/>
    </div>
  )
}
