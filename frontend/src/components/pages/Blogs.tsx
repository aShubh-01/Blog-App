import { useMemo, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useGetAllBlogs }  from '../../states/getBlogs';
import { sidebarAtom } from '../../states/sidebar';
import { AvatarIcon } from '../SubComponents';
import { AppBar } from '../AppBar';
import { SideBar } from '../SideBar';
import { htmlToString } from '../../methods/htmlToString';
import { BACKEND_URL } from '../config';
import axios from 'axios';

export default function Blogs(){
    const [sideBar, setSideBar] = useRecoilState(sidebarAtom);

    function toggleSideBar(){
        setSideBar((prev) => !prev);
    }

    useEffect(() => {
        if(sideBar == true) toggleSideBar();
    }, [])

    return <div>
        <section className={`fixed top-0`}>
            <AppBar toggleSideBar={toggleSideBar}/>
        </section>
        <section  className={`fixed top-0 left-0 rounded-md transform transition-transform duration-500 ${sideBar ? 'translate-x-0' : '-translate-x-full'}`}>
            <SideBar toggleSideBar={toggleSideBar} />
        </section>
        <div className='overflow-y-auto flex mt-[60px] justify-center'><AllBlogs/></div>
    </div>
}

type BlogCardType = {
    id: number;
    is_Saved: boolean;
    avatar: string;
    author: string;
    date: string;
    title: string;
    content: string;
}

interface BlogType {
    author: {name: string},
    content: string,
    createdAt: string,
    is_Saved: boolean
    id: number,
    title: string
}   

function AllBlogs(){
    let key = 1;
    const blogs = useGetAllBlogs();

    if(blogs.loading == true) return <div>Loading...</div>

    console.log(blogs.blogs);

    return <div>
        {
            blogs.blogs.map((blog : BlogType) => {
                return <div key={key++} className='mb-[10px]'>
                    <BlogCard id={blog.id} is_Saved={blog.savedPosts.length < 1 ? false : true} avatar={blog.author.name[0]} author={blog.author.name} date={blog.createdAt} title={blog.title} content={htmlToString(blog.content)}/>
                </div>
            })
        }
    </div>
}

function BlogCard({id, is_Saved, avatar, author, date, title, content}: BlogCardType){
    const [isSaved, setIsSaved] = useState(is_Saved);
    const navigate = useNavigate();

    const readTime = useMemo(() => {
        const words = content.split(' ').length;
        return Math.floor((words > 100 ? words / 100 : 1));
    }, []);

    function unsavePost(id: number){
        axios({
            url: `${BACKEND_URL}/api/v1/blog/unsave/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('token')
            }
        });
           
        setIsSaved(false)
    }

    function savePost(id: number){
        
        axios({
            url: `${BACKEND_URL}/api/v1/blog/save/${id}`,
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('token')
            }
        });
        
        setIsSaved(true)
    
    }

    function readPost(){
        localStorage.setItem('postId', id.toString());
        navigate('/read');
    }

    return <div className='grid-cols-3 w-[480px] p-[10px] rounded-[10px] border-[1px] border-gray-400 text-start break-words md:w-[700px]'>
        <div className='col-span-1 flex justify-between  hover:cursor-pointer' onClick={readPost}>
            <div className='flex justify-start gap-[10px]'>
                <AvatarIcon avatar={avatar} />
                <div className='pt-[7px] text-[18px] font-medium text-center'>
                    {author}
                </div>
            </div>
            <div className='pt-[10px] text-[15px] text-slate-700 font-medium text-center flex justify-between gap-[2px]'>
                <div>•</div>
                <div className='pr-[5px]'>{date}</div>
            </div>
        </div>
        <div className='col-span-1 ml-[5px] mt-[15px] text-[25px] font-serif font-bold  hover:cursor-pointer' onClick={readPost}>
            {(title.length > 100 ? title.slice(0, 100) + "..." : title)}
        </div>
        <div className='ml-[5px] my-[5px] text-[20px]  hover:cursor-pointer' onClick={readPost}>
            {(content.length > 90 ? content.slice(0, 90) + "..." : content)}
        </div>
        <div className='col-span-1 flex justify-between'>
            <div className='mt-[20px] ml-[5px] bg-gray-200 p-[3px] px-[8px] rounded-xl font-medium' onClick={readPost}>
                {readTime} min read
            </div>
            {isSaved &&
                <div className='mt-[20px]'>
                    <button onClick={() => {unsavePost(id)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </button>
                </div>
            }
            {!isSaved &&
                <div className='mt-[20px]'>
                    <button onClick={() => {savePost(id)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </button>
                    
                </div>
            }
        </div>
    </div>
}