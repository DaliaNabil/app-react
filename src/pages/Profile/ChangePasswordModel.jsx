import React, { useState, useContext } from 'react';
import { Button, Label, TextInput, Alert, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiInformationCircle } from "react-icons/hi";
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { AuthContext } from '../../context/AuthContex';
import { useNavigate } from 'react-router-dom';

const changePasswordScheme = z.object({
    password: z.string().nonempty('Current password is required.'),
    newPassword: z.string()
        .nonempty('New Password is required.')
        .min(8, 'Password must be at least 8 characters long.'),

});



export function ChangePasswordModel({ setOpenModal, openModal }) { // 💡 ملاحظة: تصحيح الاسم لـ Modal

    const { setIsLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            password: '',
            newPassword: '',

        },
        resolver: zodResolver(changePasswordScheme),
    });

const onSubmit = async (data) => {
        // ✅ 2. استخدام data وإضافة الـ Headers
        const userToken = localStorage.getItem("userToken");
        
        const { data: response } = await axios.patch(`https://linked-posts.routemisr.com/users/change-password`, data, { 
            headers: {
                token: userToken // يجب أن يكون التوكن هنا
            }
        });
        return response;
    };
    
    const {
        mutate,
        isPending,
        isError,
        error
    } = useMutation({
        mutationFn: onSubmit,
        // ✅ 3. تصحيح منطق onSuccess
        onSuccess: (response) => {
            localStorage.removeItem('userToken'); 
            setIsLogin(null);
            setSuccessMessage('Password changed successfully! Please log in again.');
            setOpenModal(false); 
            setTimeout(() => {
                navigate('/login'); // التوجيه لصفحة الدخول
            }, 1000); 
        },
        onError: (err) => {
            console.error("Change Password Error:", err); 
            // يمكن إضافة حالة لرسالة الخطأ هنا إن أردت
        }
    })

    return (
        <>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader className="border-0">Change Password</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit(mutate)} className="flex max-w-md mx-auto flex-col gap-4">

                        {/* عرض رسائل النجاح والأخطاء */}
                        {successMessage && <Alert color="success" icon={HiInformationCircle} className='mt-3'>{successMessage}</Alert>}
                        {isError && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
                            {error.response?.data?.error || "An unknown error occurred."}
                        </Alert>}

                        {/* 1. كلمة المرور الحالية */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="Current Password" >Current Password </Label>
                            </div>
                            <TextInput
                                id="password"
                                {...register('password')}
                                type="password"
                                shadow
                            />
                            {errors.password && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
                                {errors.password.message}
                            </Alert>}
                        </div>

                        {/* 2. كلمة المرور الجديدة */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="newPassword" value="New Password" >New Password </Label>
                            </div>
                            <TextInput
                                id="newPassword"
                                {...register('newPassword')}
                                type="password"
                                shadow
                            />
                            {errors.newPassword && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
                                {errors.newPassword.message}
                            </Alert>}
                        </div>

                        {/* 3. ✅ تصحيح 1: إضافة حقل تأكيد كلمة المرور الجديدة */}
                        {/* <div>
                            <div className="mb-2 block">
                                <Label htmlFor="confirmNewPassword" value="Confirm New Password" >Confirm New Password </Label>
                            </div>
                            <TextInput 
                                id="confirmNewPassword" 
                                {...register('confirmNewPassword')} 
                                type="password" 
                                shadow 
                            />
                            {errors.confirmNewPassword && <Alert color="failure" icon={HiInformationCircle} className='mt-3' >
                                {errors.confirmNewPassword.message}
                            </Alert>}
                        </div> */}

                        <Button type="submit" disabled={isPending}>
                            {isPending ? <p>Loading... </p> : 'Change Password'}
                        </Button>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="alternative" onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}