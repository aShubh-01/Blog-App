import { useGetBlog } from '../../states/getBlogs';
import { AvatarIcon } from '../SubComponents';
import parse from 'html-react-parser';
import { useRecoilState } from 'recoil';
import { AppBar } from '../AppBar';
import { SideBar } from '../SideBar';
import { sidebarAtom } from '../../states/sidebar';

export default function ReadBlog(){
    const data = useGetBlog(localStorage.getItem('postId'));
    const [sideBar, setSideBar] = useRecoilState(sidebarAtom);

    function toggleSideBar(){
        setSideBar((prev) => !prev);
    }

    if(data.loading == true) return <div> Loading Post... </div>
    if(data.blog == (undefined || null)) return <div> Unable to get blog </div>

    return <div>
        <AppBar toggleSideBar={toggleSideBar}/>
        <section  className={`fixed top-0 left-0 rounded-md transform transition-transform duration-500 ${sideBar ? 'translate-x-0' : '-translate-x-full'}`}>
            <SideBar toggleSideBar={toggleSideBar} />
        </section>
        <BlogData title={data.blog.title} content={data.blog.content} createdAt={data.blog.createdAt} authorName={data.blog.author.name}/>
    </div>
}

interface BlogInfoInterface {
    title: string,
    content: string,
    createdAt: string,
    authorName: string,
}

function BlogData({title, content, createdAt, authorName}: BlogInfoInterface){
    return <div className='md:flex justify-between'>
        <div className='mt-[10px] w-[480px] grid-cols-3 p-[5px] md:w-[1200px] md:m-[50px]'>
            <div className='my-[10px] w-[500px] md:w-[1000px] col-span-1 text-[40px] tracking-tight font-bold'>{title}</div>
            <div className='my-[10px] col-span-1 px-[10px] text-[18px] font-medium flex justify-start gap-[4px]'>Posted on {createdAt}</div>
            <div className='my-[10px] col-span-1 px-[10px] text-[23px]'>
                {parse(content)}
            </div>
        </div>
        <div className='border-[1px] p-[10px] borderborder-slate-700 h-auto w-[700px]'>
            <div className='text-[20px] m-[50px]'>
                <div className='font-medium'>Author</div>
                    <div className='flex justify-start gap-[10px] mt-[20px]'>
                    <div><AvatarIcon avatar={authorName[0]}/></div>
                    <div className='pt-[2px] text-[25px] font-medium'>{authorName}</div>
                </div>
            </div>
        </div>
    </div>
}