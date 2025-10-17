import React from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { useForm } from 'react-hook-form'; // ✅ 1. Import useForm
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import HandleUpdateDelete from '../HandleUpdateDelete/HandleUpdateDelete';

export default function CreatComment({ post }) {
  const{register, handleSubmit}=useForm({})  
 const  queryClient=  useQueryClient()
const {mutate}= useMutation({
    mutationFn:addComment ,
    onSuccess:(data)=>{
        toast.success(data.data.message)
        queryClient.invalidateQueries(['postDetails',post])
    },
    onError:()=>{
        console.log(error)
                toast.error('comment creation failed')

    }
})

async function addComment (data){
 console.log({...data ,post})
 return await axios.post(`https://linked-posts.routemisr.com/comments`,{...data,post},{
    headers:{
        token:localStorage.getItem('userToken')
    }
 })
}


    return (
        <>
            <form onSubmit={handleSubmit(mutate)}> 
                <div className="mb-2 block">
                    <Label htmlFor="comment">Your comment</Label>
                </div>
               
                <TextInput 
                    id="comment" 
                    type="text" 
                    {...register('content')} 
                    placeholder="Leave your comment..." 
                    className='mb-3'
                    shadow 
                />
                
                {/* {errors.content && <p className="text-red-500">{errors.content.message}</p>} */}

                <Button type='submit'>Add Comment</Button>
            </form>
        </>
    );
}