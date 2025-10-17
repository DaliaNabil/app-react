import React, { useState, useEffect } from 'react'; // ✅ استيراد useEffect
import { Button, Dropdown, DropdownItem, Label, Textarea, TextInput } from "flowbite-react";
import { useMutation, useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export default function HandleUpdateDelete({ isComment = true, itemId, initialContent, image }) {
      
    
    const [edit, setEdit] = useState(false);
    const [preview, setPreview] = useState(null); 

    const { register, handleSubmit, reset, watch } = useForm({ //watch
        defaultValues: {
            content: initialContent || '', 
            body: initialContent || '' 
        }
    });
    
    const queryClient = useQueryClient();

    const imageFile = watch('image');
    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            setPreview(URL.createObjectURL(imageFile[0]));
        } else if (preview) {
            // مسح العرض المسبق إذا تم إلغاء اختيار الملف
            setPreview(null);
        }
    }, [imageFile, preview]);

    // --- منطق الحذف ---
    const { mutate: handleDleteItem, isPending: isDeleting } = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            toast.success(`${isComment ? 'Comment' : 'Post'} deleted successfully.`);
            queryClient.invalidateQueries({ queryKey: isComment ? ['postDetails'] : ['posts'] }); 
        },
        onError: (err) => {
            console.error("Deletion Error:", err);
            toast.error(err.response?.data?.message || `${isComment ? 'Comment' : 'Post'} deletion failed.`);
        }
    });

    async function deleteItem() {
        const endPoint = isComment ? 'comments' : 'posts';
        return await axios.delete(`https://linked-posts.routemisr.com/${endPoint}/${itemId}`, {
            headers: {
                // 🛑 2. تصحيح رأس المصادقة للقياسي
                token:localStorage.getItem('userToken')
            }
        });
    }

    // --- منطق التحديث ---
    const { mutate: handleUpdateMutate, isPending: isUpdating } = useMutation({
        mutationFn: updateItem,
        onSuccess: () => {
             toast.success(`${isComment ? 'Comment' : 'Post'} updated successfully.`);
             setEdit(false);
             setPreview(null); 
             queryClient.invalidateQueries({ queryKey: isComment ? ['postDetails'] : ['posts'] });
        },
        onError: (err) => {
            console.error("Update Error:", err);
            toast.error(err.response?.data?.message || `${isComment ? 'Comment' : 'Post'} update failed.`);
        }
    });

    async function updateItem(data) {
        const headers = {
            token :localStorage.getItem('userToken')
        };

        if (isComment) {
            return await axios.put(`https://linked-posts.routemisr.com/comments/${itemId}`, { content: data.content }, { headers });
        } else {
            const formData = new FormData();
            formData.append('body', data.body);
            
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            }
            
            return await axios.put(`https://linked-posts.routemisr.com/posts/${itemId}`, formData, { headers });
        }
    }

    return (
        <>
            <Dropdown inline label="">
                <DropdownItem>
                    <button
                        onClick={() => setEdit(true)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        Edit
                    </button>
                </DropdownItem>

                <DropdownItem>
                    <button
                        onClick={handleDleteItem}
                        disabled={isDeleting}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </DropdownItem>
            </Dropdown>

            {edit && (
                <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-lg'>
                        <form onSubmit={handleSubmit(handleUpdateMutate)}>
                            
                            {!isComment && (
                                <>
                                    <input type='file' {...register('image')} hidden id='fileImg' /> 
                                    <label htmlFor='fileImg'>
                                        <img 
                                            src={preview || image || '/default-placeholder.png'} 
                                            alt="Post Image"
                                            className='w-full mb-3 object-cover max-h-60 cursor-pointer'
                                        />
                                    </label>
                                </>
                            )}
                            
                            {/* حقول النص */}
                            <div className="mb-4 block">
                                <Label htmlFor="edit-message">Your message</Label>
                            </div>
                            
                            {isComment ? (
                                <Textarea
                                    id="edit-message"
                                    {...register('content')}
                                    placeholder="Edit your comment..."
                                    className='mb-3'
                                    disabled={isUpdating}
                                />
                            ) : (
                                <Textarea 
                                    id="edit-body"
                                    {...register('body')}
                                    placeholder="Edit post body..."
                                    className='mb-3'
                                    disabled={isUpdating}
                                />
                            )}

                            <div className='flex gap-3 mt-4'>
                                <Button type='submit' disabled={isUpdating}>
                                    {isUpdating ? 'Updating...' : 'Update'}
                                </Button>
                                <Button color='gray' onClick={() => { setEdit(false); setPreview(null); }} disabled={isUpdating}>
                                    Close
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}