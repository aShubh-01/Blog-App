import { useGetBlog } from '../../states/getBlogs';
import { AvatarIcon } from '../SubComponents';
import parse from 'html-react-parser';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect } from 'react';
import { AppBar } from '../AppBar';
import { SideBar } from '../SideBar';
import { sidebarAtom } from '../../states/sidebar';
import { postIdAtom } from '../../states/getBlogs';

export default function ReadBlog(){
    const postId : number = useRecoilValue(postIdAtom);
    const data = useGetBlog(postId);
    const [sideBar, setSideBar] = useRecoilState(sidebarAtom);

    function toggleSideBar(){
        setSideBar((prev) => !prev);
    }

    useEffect(() => {
        if(sideBar == true) toggleSideBar();
    }, [])

    if(data.loading == true) return <div> Loading Post... </div>
    if(data.blog == (undefined || null)) return <div> Unable to get blog </div>

    const blogData : {
        title: string,
        content: string,
        updatedAt: string,
        createdAt: string,
        author: {
            name: string
        }
    } = data.blog
    return <div>
         <section className={`fixed top-0`}>
            <AppBar toggleSideBar={toggleSideBar}/>
        </section>
        <section  className={`fixed top-0 left-0 rounded-md transform transition-transform duration-500 ${sideBar ? 'translate-x-0' : '-translate-x-full'}`}>
            <SideBar toggleSideBar={toggleSideBar} />
        </section>
        <div className='mt-[50px]'>
        <BlogData title={blogData.title} content={blogData.content} updatedAt = {blogData.updatedAt} createdAt={blogData.createdAt} authorName={blogData.author.name}/>
        </div>
    </div>
}

interface BlogInfoInterface {
    title: string,
    content: string,
    updatedAt: string,
    createdAt: string,
    authorName: string,
}

function BlogData({title, content, createdAt, updatedAt, authorName}: BlogInfoInterface){

    return <div className='md:flex px-[5px] break-words justify-between'>
        <div className='mt-[10px] w-[480px] grid-cols-3 p-[5px] md:w-[1200px] md:m-[50px]'>
            <div className='my-[10px] w-[500px] md:w-[1000px] col-span-1 text-[25px] md:text-[40px] tracking-tight font-bold'>{title}</div>
            <div className='my-[10px] col-span-1 px-[10px] text-[15px] md:text-[18px] font-medium gap-[4px]'>
                <div>Posted on : {createdAt}</div>
                <div>Last Updated : {updatedAt}</div>
            </div>
            <div className='my-[10px] col-span-1 px-[10px] text-[20px] md:text-[23px]'>
                {parse(content)}
            </div>
        </div>
        <div className='border-[1px] p-[10px] borderborder-slate-700 h-auto w-[700px]'>
            <div className='text-[20px] m-[50px]'>
                <div className='font-medium'>Author</div>
                    <div className='flex justify-start gap-[10px] mt-[20px]'>
                    <div><AvatarIcon avatar={authorName[0]}/></div>
                    <div className='pt-[5px] md:pt-[2px] text-[20px] md:text-[25px] font-medium'>{authorName}</div>
                </div>
            </div>
        </div>
    </div>
}