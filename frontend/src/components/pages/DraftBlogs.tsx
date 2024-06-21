import { AppBar } from '../AppBar';
import { SideBar } from '../SideBar';
import { sidebarAtom } from '../../states/sidebar';
import { useRecoilState, useSetRecoilState} from 'recoil';
import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDraftBlogs } from '../../states/getBlogs';
import { htmlToString } from '../../methods/htmlToString';
import { draftBlogDataAtom } from '../../states/draftBlogData';

export default function DraftBlogs(){
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
        <div className='mt-[60px] flex justify-center'><AllDraftBlogs /></div>
    </div>
}

interface DraftBlogCardInterface {
    updatedAt: string;
    title: string;
    content: string;
}

function AllDraftBlogs(){
    let key = 1;
    const navigate = useNavigate();
    const data = useGetDraftBlogs();
    const setDraftBlogData = useSetRecoilState(draftBlogDataAtom);

    if(data.loading == true) return <div>Loading...</div>
    if(data.drafts == (null || undefined)) return <div>Unable to get drafts</div>
    if(data.drafts.length < 1) return <div className='text-[30px] text-center font-mono font-semibold m-[100px]'>No Drafts Saved, Get <div className='text-slate-600 hover:cursor-pointer' onClick={() => {navigate('/write')}}>Writing!</div></div>

    interface DraftData {
        id: string,
        title: string,
        content: string
        updatedAt: string
    }

    return <div className={`grid flex justify-center grid-cols-1 md:grid-cols-3 gap-[5px]`}>
        {
            data.drafts.map((draft: DraftData) => {
                return <div key={key++} className='m-[5px]' onClick={() => {
                    setDraftBlogData({
                        id: draft.id,
                        title: draft.title,
                        content: draft.content
                    });
                    navigate('/write');
                }}>
                    <DraftBlogCard updatedAt={draft.updatedAt} title={draft.title} content={htmlToString(draft.content)} />
                </div>
            })   
        }
    </div>
}

function DraftBlogCard({updatedAt, title, content}: DraftBlogCardInterface){

    const readTime = useMemo(() => {
        const words = content.split(' ').length;
        return Math.floor((words > 100 ? words / 100 : 1));
    }, []);

    return <div className='border-[1px] p-[10px] border-gray-400 break-words rounded-[15px] w-[480px]'>
        <div>
            <div className='text-[25px] font-serif font-bold'>{title.length > 50 ? title.slice(0, 350) + '...' : title}</div>
        </div>
        <div className='my-[5px] px-[3px] text-[20px]'>{content.length > 90 ? content.slice(0, 90) + '...' : content}</div>
        <div className='flex justify-between pt-[7px]'>
            <div className='bg-gray-200 h-[35px] text-center p-[5px] px-[7px] font-medium rounded-[15px]'>
                {readTime} min read
            </div>
            <div className='flex justify-between gap-[10px]'>
                <div className='py-[6px] text-[15px] text-slate-700 font-medium text-center'>Last Updated • {updatedAt}</div>
            </div>
        </div>
    </div>
}
