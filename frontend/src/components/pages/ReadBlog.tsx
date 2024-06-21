import { useGetBlog } from '../../states/getBlogs';
import { AvatarIcon } from '../SubComponents';
import parse from 'html-react-parser';
import { useRecoilState } from 'recoil';
import { useEffect, useMemo } from 'react';
import { AppBar } from '../AppBar';
import { SideBar } from '../SideBar';
import { sidebarAtom } from '../../states/sidebar';
import { LoadRead } from '../AnimatedComponents';

export default function ReadBlog(){
    const [sideBar, setSideBar] = useRecoilState(sidebarAtom);

    const postId : number = useMemo(() => {
        const post_id = localStorage.getItem('postId');
        if(post_id != (null || undefined)) return parseInt(post_id);
        else return 0;
    }, []);

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
        <div className='mt-[50px]'>
            <BlogData postId={postId}/>
        </div>
    </div>
}

function BlogData({postId} : {postId: number}){
    const data = useGetBlog(postId);

    if(data.loading == true) return <div className='my-[300px] flex justify-center'><div><LoadRead /></div></div>
    if(data.blog == (undefined || null)) return <div className='p-[5px]'> Unable to get blog </div>

    const blogData : {
        author: {
            name: string
        },
        title: string,
        content: string,
        updatedAt: string,
        createdAt: string,
    } = data.blog

    return <div className='md:flex px-[5px] break-words justify-between'>
        <div className='mt-[10px] w-[480px] grid-cols-3 p-[5px] md:w-[1200px] md:m-[50px]'>
            <div className='my-[10px] w-[500px] md:w-[1000px] col-span-1 text-[25px] md:text-[40px] tracking-tight font-bold'>{blogData.title}</div>
            <div className='my-[10px] col-span-1 px-[10px] text-[15px] md:text-[18px] font-medium gap-[4px]'>
                {(blogData.createdAt != blogData.updatedAt) &&
                    <div>
                        <div>Posted on : {blogData.createdAt}</div>
                        <div>Last Updated : {blogData.updatedAt}</div>   
                    </div>         
                }
                {(blogData.createdAt == blogData.updatedAt) &&
                    <div>Posted on : {blogData.createdAt}</div>
                }
            </div>
            <div className='my-[10px] col-span-1 px-[10px] text-[20px] md:text-[23px]'>
                {parse(blogData.content)}
            </div>
        </div>
        <div className='border-[1px] p-[10px] borderborder-slate-700 h-auto w-[700px]'>
            <div className='text-[20px] m-[50px]'>
                <div className='font-medium'>Author</div>
                    <div className='flex justify-start gap-[10px] mt-[20px]'>
                    <div><AvatarIcon avatar={blogData.author.name[0]}/></div>
                    <div className='pt-[5px] md:pt-[2px] text-[20px] md:text-[25px] font-medium'>{blogData.author.name}</div>
                </div>
            </div>
        </div>
    </div>
}