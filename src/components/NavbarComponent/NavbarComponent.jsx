
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from './../../context/AuthContex';

export function NavbarComponent() {
 const{isLogin ,setIsLogin ,userDate} = useContext(AuthContext)
const navigate = useNavigate()
 const handleLogOut=()=>{
        setIsLogin(null)
        localStorage.removeItem('userToken')
        navigate('/login')
    }
  return (
    <Navbar className=" shadow-md">
      <NavbarBrand as={Link} to="/">
        <span className="self-center whitespace-nowrap text-xl text-sky-600 font-bold dark:text-white">Social App</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img={userDate?.photo} rounded />
          }
        >
          <DropdownHeader>
            <span className="block text-sm">{userDate?.name}</span>
            <span className="block truncate text-sm font-medium">{userDate?.email}</span>
          </DropdownHeader>
          <DropdownItem as={Link} to='/register'>Register</DropdownItem>
          <DropdownItem as={Link} to='/' >Login</DropdownItem>
        {isLogin&& <>
          <DropdownItem as={Link} to='/profile'>Profile</DropdownItem>
          <DropdownDivider />
          <DropdownItem as={'button'} onClick={handleLogOut} >Sign out</DropdownItem>
        </>}
        </Dropdown>
        <NavbarToggle />
      </div>
   {isLogin &&   <NavbarCollapse>
        <NavbarLink as={NavLink} to='/home'>
          Home
        </NavbarLink>
        <NavbarLink href="#">About</NavbarLink>
    
      </NavbarCollapse>}
    </Navbar>
  );
}

