import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Alert, Button } from 'flowbite-react'
import React, { useState } from 'react'
import { HiInformationCircle } from 'react-icons/hi'
import PostItem from './../../components/PostItem/PostItem';
import CreatePost from '../../components/CreatePost/CreatePost'

export default function Home() {
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1) 
    
    const { isLoading, isError, error, data, isFetching } = useQuery({
        queryKey: ['posts', page],
        queryFn: getPosts,
        keepPreviousData: true, 
    })

    async function getPosts() {
        const { data } = await axios(`https://linked-posts.routemisr.com/posts?limit=15&page=${page}&sort=-createdAt`, { 
            headers: {
                token: localStorage.getItem('userToken')
            }
        })
        
        if (data.paginationInfo?.numberOfPages) {
            setTotalPages(data.paginationInfo.numberOfPages);
        }
        return data
    }

 

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
    
       function handleNext() {
        if (page < totalPages) { 
            setPage((prev) => prev + 1);
        }
    }
    
    function handlePrev() {
        setPage((prev) => (prev > 1 ? prev - 1 : 1));
    }

    return (
        <>
        <CreatePost />
            {data?.posts.map((post) => <PostItem key={post._id} post={post} />)}
            
            <div className='flex justify-center items-center gap-3 my-5' >
                
                <Button onClick={handlePrev} disabled={page === 1 || isFetching} >Prev</Button> 
                
                <p className='font-bold text-lg'>Page {page}</p>
                
                <Button onClick={handleNext} disabled={page === totalPages || isFetching} >Next</Button>
            </div>
        </>
    )
}