import { Alert } from 'flowbite-react';
import React from 'react'
import { HiInformationCircle } from 'react-icons/hi';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PostItem from '../../components/PostItem/PostItem';

export default function PostDetails() {
    const { id } = useParams()
    console.log(id)

    const { isLoading, isError, error, data} = useQuery({
        queryKey: ['postsDetails', id],
        queryFn: getSinglePost,
    })
    async function getSinglePost() {
        const { data } = await axios(`https://linked-posts.routemisr.com/posts/${id}`, {
            headers: {
                token: localStorage.getItem('userToken')
            }
        })

        return data
    }

    if (isError) {
        const errorMessage = error.response?.data?.error || error.message;
        return <Alert color="failure" icon={HiInformationCircle} className='mt-3 max-w-md mx-auto'>
            {errorMessage}
        </Alert>
    }


     if (isLoading) {
        return (<div className='text-center my-10'>
            <p className='text-xl font-semibold text-sky-600'>Loading Post Details...</p>
        </div>)
    }
    console.log(data)


    return (
      <div className='max-w-xl mx-auto'>
        <PostItem post={data?.post} />
      </div>
    )
}
