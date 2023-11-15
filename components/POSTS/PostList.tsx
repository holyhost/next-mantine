"use client"
import { Container } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import PostItem, { PostItemProps } from './PostItem'
import { notifications } from '@mantine/notifications'



const PostList = ({data}:{data: PostItemProps[]}) => {
  const [items, setItems] = useState<PostItemProps[]>([])
  const onItemDelete = async(id: string)=>{
    const response = await fetch('/api/posts/' + id, {
      method: 'DELETE'
    })
    if(response.ok){
      setItems([...items.filter(item => item._id !== id)])
      notifications.show({
        title: "🎉 🎉 🎉 恭喜 🎉 🎉 🎉",
        message: `数据删除成功！`
      })
    }else{
      notifications.show({
        title: "😒 😒 😒 出错了 😒 😒 😒",
        message: `数据删除失败！`
      })
    }
  }
  useEffect(()=>{
    setItems([...data])
  }, [data])
  return (
    <>
        {items && items.map(item => <PostItem key={item._id} deleteItem={()=>onItemDelete(item._id)} data={item}/>)}
    </>
  )
}

export default PostList
