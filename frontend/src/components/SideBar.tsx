import { SideBarLogo } from './AppBar';
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleLine } from "react-icons/ri";
import { useSetRecoilState } from 'recoil';
import { draftBlogDataAtom } from '../states/draftBlogData';

interface ToggleSideBarType {
    toggleSideBar: () => void
}

export function SideBar({toggleSideBar}: ToggleSideBarType){
    const navigate = useNavigate();
    const setDraftBlogData = useSetRecoilState(draftBlogDataAtom);

    function cleanUp(){
        toggleSideBar();
    }

    return <div className='bg-gray-100 border-[1px] border-gray-500 w-[233px] p-[4px] rounded-lg h-screen'>
        <div className='flex justify-start p-[3px] gap-[10px]'>
            <SideBarLogo toggleSideBar={toggleSideBar}/>
            <div className='text-[30px] ml-[20px] font-mono font-bold'>Menu</div>
        </div>
        <div>
            <div className=''>
                <MenuItem logo={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>}
                title="Home" onClickEvent={() => {
                    cleanUp();
                    navigate('/blogs')
                }}/>
            </div>
            <div>
                <MenuItem logo={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
                title="New Blog" onClickEvent={() => {
                    cleanUp();
                    setDraftBlogData({id: '', title: '', content: ''});
                    navigate('/write');
                }}/>
            </div>
            <div>
                <MenuItem logo={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" /></svg>}
                title="Drafts" onClickEvent={() => {
                    cleanUp();
                    navigate('/drafts');
                }}/>
            </div>
            <div>
                <MenuItem logo={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" /></svg>}
                title="Bookmarks" onClickEvent={() => {
                    cleanUp();
                    navigate('/bookmarks')
                }}/>
            </div>
            {/* <div>
                <MenuItem logo={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>}
                title="Profile" onClickEvent={() => {
                    cleanUp();
                }}/>
            </div> */}
            <div>
                <MenuItem logo={<div className='py-[4px]'><RiLogoutCircleLine /></div>}
                title="Log Out" onClickEvent={() => {
                    cleanUp();
                    localStorage.clear();
                    navigate('/');
                }} />
            </div>
        </div>
    </div>
}

type MenuItemType = {
    logo: any,
    title: string,
    onClickEvent: () => void
}

function MenuItem({logo, title, onClickEvent}: MenuItemType ) {
    return <button onClick={onClickEvent}>
        <div className={`text-[20px] m-[10px] p-[10px] ml-[7px] w-[200px] flex justify-start gap-[5px] border-[1px] border-black font-sans font-semibold rounded-lg hover:bg-gray-300 bg-slate-100`}>
            <div> 
                <div className='p-[2px]'>
                    {logo}
                </div>
            </div>
            <div>
                {title}
            </div>
        </div>
    </button>
}