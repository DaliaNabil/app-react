import React, { useState } from 'react'
import { Button, Label, TextInput } from "flowbite-react";
import { Radio } from "flowbite-react";
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import { zodResolver } from './../../../node_modules/@hookform/resolvers/zod/src/zod';
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';


export default function Register() {
  // const[apiError , setApiError]= useState(null)
  const [successMessage, setSuccessMessage] = useState(null);
  // const [loading , setLoading] = useState(false)

  const navigate = useNavigate()
  const registerScheme = z.object({

    name: z.string()
      .nonempty('Name is required.')
      .min(3, 'Name must be at least 3 characters long.')
      .max(10, 'Max length is 10 characters.'),

    email: z.string().email('Invalid email format.')
      .nonempty('Email is required.'),

    password: z.string()
      .nonempty('Password is required.')
      .min(8, 'Password must be at least 8 characters long.')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must include uppercase, lowercase, number, and a special character.'),

    rePassword: z.string()
      .nonempty('rePassword confirmation is required.'),

    dateOfBirth: z.coerce.string()
      .nonempty('Date of birth is required.'),


    gender: z.enum(['male', 'female'], {
      message: 'Please select a gender.',
    }),


  }).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match.",
    path: ['rePassword'],
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: 'famel'
    },
    resolver: zodResolver(registerScheme)
  })

  const onSubmit = async (data) => {

    // setLoading(true);
    // setApiError(null); 
    // setSuccessMessage(null); 

    // try {
    const { data: response } = await axios.post(`https://linked-posts.routemisr.com/users/signup`, data);
    console.log(response)
    // navigate('/')




    // } catch(error) {
    //     console.log("Registration Error:", error); 
    //     setSuccessMessage(null); 
    //     setApiError(error.response?.data?.error ); 

    // } finally {

    //     setLoading(false);
    // }
  }
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      reset()
      navigate('/login')
      toast.success('success')
    },
    onError: () => {
      console.log(error)
      toast.error('failed')
    }
  })
  return (

    <>
      <div className='my-8'>

        <h2 className='text-center text-sky-800 font-semibold text-3xl'>Register</h2>

        <form onSubmit={handleSubmit(mutate)} className="flex max-w-md mx-auto  flex-col gap-4">
          {successMessage &&
            <Alert color="success" icon={HiInformationCircle} className='mt-3'>
              {successMessage}
            </Alert>}
          {isError && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
            {error.response.data.error}
          </Alert>}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name">Your Name </Label>
            </div>

            <TextInput id="name" {...register('name')} type="text" placeholder="name ...." shadow />
            {errors.name && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
              {errors.name.message}
            </Alert>}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="email2">Your email</Label>
            </div>
            <TextInput id="email2" type="email" {...register('email')} placeholder="name@flowbite.com" shadow />
            {errors.email && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
              {errors.email.message}
            </Alert>}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="password2">Your password</Label>
            </div>
            <TextInput id="password2" {...register('password')} type="password" shadow />
            {errors.password && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
              {errors.password.message}
            </Alert>}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="repeat-password">Repeat password</Label>
            </div>
            <TextInput id="repeat-password" {...register('rePassword')} type="password" shadow />
            {errors.rePassword && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
              {errors.rePassword.message}
            </Alert>}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="date">Date Of Birth</Label>
            </div>
            <TextInput id="date" {...register('dateOfBirth')} type="date" shadow />
            {errors.dateOfBirth && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
              {errors.dateOfBirth.message}
            </Alert>}
          </div>
          <div className="flex max-w-md flex-col gap-4">
            <div className="flex items-center gap-2">
              <Radio id="femal" {...register('gender')} value="female" />
              <Label htmlfor="femal">Female</Label>

            </div>
          </div>
          <div className="flex max-w-md flex-col gap-4">
            <div className="flex items-center gap-2">
              <Radio id="mal" {...register('gender')} value="male" />
              <Label htmlfor="mal">Male</Label>

            </div>
          </div>
          {errors.gender && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
            {errors.gender.message}
          </Alert>}
          <Button type="submit">{isPending ? <p>loading... </p> : 'Register new account'}</Button>
        </form>
      </div>
    </>
  );
}

