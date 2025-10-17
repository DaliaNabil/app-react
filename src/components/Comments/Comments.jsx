import { useQuery } from '@tanstack/react-query' // 👈 تم حذف useQueries
import axios from 'axios'
import React from 'react'
import CommentItem from './CommentItem';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi'; 


export default function Comments({ id }) {

    async function getComments() {
        const { data } = await axios.get(`https://linked-posts.routemisr.com/posts/${id}/comments`, {
            headers: {
                token: localStorage.getItem('userToken')
            }
        })
        return data
    }
    
    const { isLoading, isError, error, data } = useQuery({ 
        queryKey: ['COMMENTS', id], 
        queryFn: getComments,
    })

    if (isError) {
        const errorMessage = error.response?.data?.error || error.message;
        return (
            <Alert color="failure" icon={HiInformationCircle} className='mt-3 max-w-md mx-auto'>
                {errorMessage}
            </Alert>
        )
    }

    if (isLoading) {
        return (<div className='text-center my-10'>
            <p className='text-xl font-semibold text-sky-600'>Loading Comments...</p>
        </div>)
    }

    return (
        <div>
            {data?.comments?.map((comment) => <CommentItem comment={comment} key={comment._id} />)}
        </div>
    )
}