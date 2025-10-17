import React, { useState } from 'react'
import { Button, Card } from "flowbite-react";
import { Link, useLocation } from 'react-router-dom';
import Comments from './../Comments/Comments';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import { FaCommentAlt } from "react-icons/fa";
import CreatComment from '../Comments/CreatComment';
import HandleUpdateDelete from '../HandleUpdateDelete/HandleUpdateDelete';
import { formatDate } from './../../lib/FormatDate';

export default function PostItem({ post }) {
    const loc = useLocation()
    const locationPath = loc.pathname.startsWith('/post')
    const [open, setOpen] = useState(locationPath)

    console.log(post)
    const { _id, body, image, createdAt, user: { photo, name }, comments } = post
    return (

        <Card className='max-w-2xl mx-auto my-5' >
          <div className="flex justify-between">
  <div className='flex  gap-3'>
                <img src={photo} alt='' className='w-15 h-15 rounded-full' />
                <div>
                    <span> {name} </span>
                    <p> {formatDate(createdAt)} </p>
                </div>
                <HandleUpdateDelete isComment={false} itemId={_id} image={image} />
            </div>
          </div>
            <img src={image} alt='' />

            <p className="font-normal break-words text-gray-700 dark:text-gray-400">      {body}      </p>
            <div className='flex gap-3' >
                <FaCommentAlt fontSize={'25'} />
                {comments.length}
            </div>

            <Button as={Link} to={`/postDetails/${_id}`} >
                Show details
                <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </Button>
            <CreatComment post={_id} />
            

            {post?.comments?.[post.comments.length - 1] && <>
                <div className='flex gap-3 bg-gray-100 my-5 rounded-lg p-3'>
                    <img
                        src={comments[comments.length - 1]?.commentCreator?.photo}
                        alt=''
                        className='w-15 h-15 rounded-full'
                        onError={(e) => e.currentTarget.src = '/public/vite.svg'} />
                    <span> {comments[comments.length - 1]?.commentCreator?.name}</span>
                    <p> {formatDate(comments[comments.length - 1]?.commentCreator?.createdAt)} </p>
                    <p className='font-semibold'>{comments[comments.length - 1]?.content}</p>
                </div></>}
            <Accordion collapseAll={!locationPath} alwaysOpen={locationPath}>
                <AccordionPanel>
                    <AccordionTitle>Show more comments</AccordionTitle>
                    <AccordionContent>
                        <Comments id={_id} />
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>

        </Card>
    );
}

