import { AppBar } from '../AppBar';
import { SideBar } from '../SideBar';
import { sidebarAtom } from '../../states/sidebar';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { AvatarIcon } from '../SubComponents';
import { useGetSavedBlogs } from '../../states/getBlogs';
import { htmlToString } from '../../methods/htmlToString';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export default function SavedBlogs(){
    const [sideBar, setSideBar] = useRecoilState(sidebarAtom);
    
    function toggleSideBar(){
        setSideBar((prev) => !prev);
    }

    useEffect(() => {
        if(sideBar == true) toggleSideBar();
    }, []);

    return <div>
        <section className={`fixed top-0`}>
            <AppBar toggleSideBar={toggleSideBar}/>
        </section>
        <section  className={`fixed top-0 left-0 rounded-md transform transition-transform duration-500 ${sideBar ? 'translate-x-0' : '-translate-x-full'}`}>
            <SideBar toggleSideBar={toggleSideBar} />
        </section>
        <div className='mt-[100px] flex justify-center'>
            <AllSavedBlogs />
        </div>
    </div>
}

interface DraftBlogCardInterface {
    post: {
        id: number;
        title: string;
        content: string;
        avatar: string;
        author: {
            name: string
        };
        createdAt: string;
        isDeleted: string;
        published: string;
    }
}

interface DraftBlogCardInterface2 {
        id: number;
        title: string;
        content: string;
        avatar: string;
        author: string
        createdAt: string;
}


function AllSavedBlogs(){
    let key = 1;
    const data = useGetSavedBlogs();
    const navigate = useNavigate();

    if(data.loading == true) return <div>Loading...</div>
    if(data.savedBlogs == (null || undefined)) return <div>Unable to get saved blogs</div>
    if(data.savedBlogs.length < 1) return <div className='text-[30px] text-center font-mono font-semibold m-[100px]'>No Posts Saved, <div className='text-slate-600 hover:cursor-pointer' onClick={() => {navigate('/blogs')}}>Read & Explore!</div></div>


    return <div className='grid grid-cols-1 md:grid-cols-3'>
        {
            data.savedBlogs.map((blog: DraftBlogCardInterface) => {
                if(!(blog.post.isDeleted) && (blog.post.published)){
                    return <div className='m-[5px]' key={key++}>
                        <SavedBlogCard
                            id={blog.post.id}
                            title={blog.post.title}
                            content={htmlToString(blog.post.content)}
                            avatar={blog.post.author.name[0]}
                            author={blog.post.author.name}
                            createdAt={blog.post.createdAt}
                        />
                    </div>
                } else return
                
            })
        }
    </div>
}

function SavedBlogCard({id, title, content, avatar, author, createdAt}: DraftBlogCardInterface2){
    const [isSaved, setIsSaved] = useState(true);
    const navigate = useNavigate();

    const readTime = useMemo(() => {
        const words = content.split(' ').length;
        return Math.floor((words > 100 ? words / 100 : 1));
    }, []);

    function readPost(){
        localStorage.setItem('postId', id.toString())
        navigate('/read');
    }

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

    return <div className='grid-cols-3 w-[480px] max-h-[300px] p-[10px] rounded-[10px] border-[1px] border-gray-400 text-start break-words'>
        <div className='col-span-1 flex justify-between hover:cursor-pointer' onClick={readPost}>
            <div className='flex justify-start gap-[10px]'>
                <AvatarIcon avatar={avatar} />
                <div className='pt-[7px] text-[18px] font-medium text-center'>
                    {author}
                </div>
            </div>
            <div className='pt-[10px] text-[15px] text-slate-700 font-medium text-center flex justify-between gap-[2px] hover:cursor-pointer' onClick={readPost}>
                <div>•</div>
                <div className='pr-[5px]'>{createdAt}</div>
            </div>
        </div>
            <div className='col-span-1 ml-[5px] mt-[15px] text-[25px] font-serif font-bold hover:cursor-pointer' onClick={readPost}>
                {(title.length > 35 ? title.slice(0, 35) + "..." : title)}
            </div>
            <div className='ml-[5px] my-[5px] text-[20px]'>
                {(content.length > 90 ? content.slice(0, 90) + "..." : content)}
            </div>
        <div className='col-span-1 flex justify-between'>
            <div className='mt-[20px] ml-[5px] bg-gray-200 p-[3px] px-[8px] rounded-xl font-medium hover:cursor-pointer' onClick={readPost}>
                {readTime} min read
            </div>
            <div className='mt-[20px]'>
                {isSaved &&
                    <button onClick={() => {unsavePost(id)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </button>
                }
                {!isSaved &&
                    <button onClick={() => {savePost(id)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </button>
                }
            </div>
        </div>
    </div>
}