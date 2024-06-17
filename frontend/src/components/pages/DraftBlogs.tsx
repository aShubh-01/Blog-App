import { AppBar } from '../AppBar';
import { SideBar } from '../SideBar';
import { sidebarAtom } from '../../states/sidebar';
import { useRecoilState} from 'recoil';
import { useMemo } from 'react';
import { useGetDraftBlogs } from '../../states/getBlogs';

export default function DraftBlogs(){
    const [sideBar, setSideBar] = useRecoilState(sidebarAtom);

    function toggleSideBar(){
        setSideBar((prev) => !prev);
    }

    return <div>
        <AppBar toggleSideBar={toggleSideBar}/>
        <section  className={`fixed top-0 left-0 rounded-md transform transition-transform duration-500 ${sideBar ? 'translate-x-0' : '-translate-x-full'}`}>
            <SideBar toggleSideBar={toggleSideBar} />
        </section>
        <div className='flex justify-center'><AllDraftBlogs /></div>
    </div>
}

interface DraftBlogCardInterface {
    createdAt: string;
    title: string;
    content: string;
}

function AllDraftBlogs(){
    let key = 1;
    const data = useGetDraftBlogs();

    if(data.loading == true) return <div>Loading...</div>
    if(data.drafts == (null || undefined)) return <div>Unable to get drafts</div>

    console.log(data.drafts);

    return <div className={`grid flex justify-center grid-cols-1 md:grid-cols-3 gap-[5px]`}>
        {
            data.drafts.map((draft) => {
                return <div key={key++} className='m-[5px]'>
                    <DraftBlogCard createdAt={draft.createdAt} title={draft.title} content={draft.content} />
                </div>
            })   
        }
    </div>
}

function DraftBlogCard({createdAt, title, content}: DraftBlogCardInterface){

    const readTime = useMemo(() => {
        const words = content.split(' ').length;
        return Math.floor((words > 100 ? words / 100 : 1));
    }, []);

    return <div className='border-[1px] p-[10px] border-gray-400 break-words rounded-[15px] w-[450px]'>
        <div>
            <div className='text-[25px] font-serif font-bold'>{title.length > 50 ? title.slice(0, 350) + '...' : title}</div>
        </div>
        <div className='my-[5px] px-[3px] text-[20px]'>{content.length > 90 ? content.slice(0, 90) + '...' : content}</div>
        <div className='flex justify-between pt-[7px]'>
        <div className='bg-gray-200 h-[35px] text-center p-[5px] px-[10px] font-medium rounded-[15px]'>
                {readTime} min read
            </div>
            <div className='p-[3px] text-[15px] text-slate-700 font-medium text-center'>Created • {createdAt}</div>
        </div>
    </div>
}
