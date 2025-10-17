import React, { useState, useContext } from 'react';
import { Button, Label, TextInput, Alert } from "flowbite-react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiInformationCircle } from "react-icons/hi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../context/AuthContex';
import { useMutation } from '@tanstack/react-query';


const loginScheme = z.object({
    email: z.string().email('Invalid email format.').nonempty('Email is required.'),
    password: z.string()
        .nonempty('Password is required.')
        .min(8, 'Password must be at least 8 characters long.')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must include uppercase, lowercase, number, and a special character.'),
});

export default function Login() {
    const { isLogin, setIsLogin } = useContext(AuthContext)
    
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginScheme),
    });

    const onSubmit = async (data) => {
        const { data: response } = await axios.post(`https://linked-posts.routemisr.com/users/signin`, data);
        return response;
    };
    
    const { 
        mutate, 
        isPending, 
        isError, 
        error 
    } = useMutation({
        mutationFn: onSubmit,
        onSuccess: (response) => {
            localStorage.setItem('userToken', response.token)
            setIsLogin(response.token) 
            setSuccessMessage('Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/home')
            }, 500); 
        },
        onError: (err) => {
             console.log("Login Error:", err);
        }
    })
    
    return (
        <>
            <div className='my-8'>
                <h2 className='text-center text-sky-800 font-semibold text-3xl'>Login</h2>

                <form onSubmit={handleSubmit(mutate)} className="flex max-w-md mx-auto flex-col gap-4">
                    
                    {successMessage &&
                        <Alert color="success" icon={HiInformationCircle} className='mt-3'>
                            {successMessage}
                        </Alert>}
                        
                    {isError && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
                        {error.response?.data?.error || "An unknown error occurred."} 
                    </Alert>}

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email2" value="Your email" />
                        </div>
                        <TextInput 
                            id="email2" 
                            type="email" 
                            {...register('email')} 
                            placeholder="name@flowbite.com" 
                            shadow 
                        />
                        {errors.email && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
                            {errors.email.message}
                        </Alert>}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password2" value="Your password" />
                        </div>
                        <TextInput 
                            id="password2" 
                            {...register('password')} 
                            type="password" 
                            shadow 
                        />
                        {errors.password && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
                            {errors.password.message}
                        </Alert>}
                    </div>

                 
                    <Button type="submit" disabled={isPending}> 
                        {isPending ? <p>Loading... </p> : 'Login'} 
                    </Button>
                </form>
            </div>
        </>
    );
}