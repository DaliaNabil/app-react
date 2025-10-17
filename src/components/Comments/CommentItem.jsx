import React from 'react'
import HandleUpdateDelete from '../HandleUpdateDelete/HandleUpdateDelete';
import { formatDate } from '../../lib/FormatDate';

export default function CommentItem({comment}) {
    console.log(comment)
    const {content , commentCreator:{photo,name} ,createdAt ,_id} =comment
  return (
  <>

           
            <div className='flex flex-col gap-3 bg-gray-100 my-5 rounded-lg p-3'>
                <div className="flex  justify-between">
<div className=" flex gab-3">


                               <img
                                   src={photo}
                                   alt=''
                                   className='w-15 h-15 rounded-full'
                                   onError={(e) => e.currentTarget.src = '/vite.svg'} />
                               <span> {name}</span>
                               <p> {formatDate(createdAt)} </p>
</div>

                <HandleUpdateDelete  itemId={_id} />
                </div>
                               <p className=' ps-12 font-semibold'>{content}</p>
                           </div>
              </>
  )
}
