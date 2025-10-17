import React, { useCallback, useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContex'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query';
import { Alert, Button } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import PostItem from '../../components/PostItem/PostItem';
import { Card, Dropdown, DropdownItem } from "flowbite-react";
import { ChangePasswordModel } from './ChangePasswordModel';

export default function Profile() {
 let{userDate}= useContext(AuthContext)
   const [openModal, setOpenModal] = useState(false);

 async function getUserPosts(){
  const {data}= await axios.get(`https://linked-posts.routemisr.com/users/${userDate._id}/posts`,{
    headers:{
      token:localStorage.getItem('userToken')
    }
  })
  return data
 }
 const {data, isLoading, isError, error}= useQuery({
  queryKey:['profile',userDate?._id],
  queryFn:getUserPosts
 })
  if (isLoading && !data) {
         return (<div className='text-center my-10'>
             <p className='text-xl font-semibold text-sky-600'>Loading Posts...</p>
         </div>)
     }
     
     if (isError) {
         const errorMessage = error.response?.data?.error || error.message;
         return <Alert color="failure" icon={HiInformationCircle} className='mt-3 max-w-md mx-auto'>
             {errorMessage}
         </Alert>
     }
     console.log(data)
  return (
    <>
    <Card className="max-w-2xl mx-auto  pt-5">
      <div className="flex justify-end px-4 pt-4">
        <Dropdown inline label="">
          <DropdownItem>
            <button
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
             Upload Photo
            </button>
          </DropdownItem>
        </Dropdown>
      </div>
      <div className="flex flex-col items-center pb-10">
        <img
          alt="Bonnie image"
          height="96"
          src={userDate.photo}
          width="96"
          className="mb-3 rounded-full shadow-lg"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{userDate.name}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{userDate.email}</span>
        <div className="mt-4 flex space-x-3 lg:mt-6">
          <Button  onClick={() => setOpenModal(true)}
            href="#"
            className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
           Change Password
          </Button>
       
        </div>
      </div>
    </Card>

    {data.posts&& data.posts.map((post)=><PostItem post={post} key={post._id} />)}
  {openModal&& <ChangePasswordModel openModal={openModal} setOpenModal={setOpenModal} />}
    </>
  )
}
