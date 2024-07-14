import { useMediaQuery } from '@mui/material';
import { AvatarIcon } from './SubComponents';

interface ToggleSideBarType {
    toggleSideBar: () => void;
}

export function AppBar({toggleSideBar}: ToggleSideBarType){
    const isSmallScreen = useMediaQuery('(max-width:640px)');
    let username = localStorage.getItem('username');
    if(!username) {
        username = "User";
    } else if(username.split(' ').length > 1){
        username = username.split(' ')[0];
    }

    return <div className='bg-white'>
        <div className='h-[50px] flex justify-between'>
            <div className='flex justify-start p-[7px] gap-[10px]'>
                <div><SideBarLogo toggleSideBar={toggleSideBar}/></div>
                <div className='p-[2px]'><AppLogo /></div>
            </div>
            <div className='flex justify-between gap-[10px] p-[9px] mr-[10px]'>
                <div className='pt-[1px] text-[25px] font-semibold flex justify-between gap-[5px]'>
                    <div>Welcome!</div>
                    {!isSmallScreen &&
                        <div>{username}</div>
                    }
                </div>
                <div className='flex justify-between gap-[10px]'>
                    <div><AvatarIcon avatar={username[0]}/></div>
                </div>
            </div>
        </div>
        <div className='my-[5px]'>
            <hr className='border-black w-screen'/>
        </div>
    </div>
}

export function SideBarLogo({toggleSideBar}: ToggleSideBarType){
    return <div className='bg-gray-300 rounded-md border-[2px] border-black h-[40px] w-[40px]'>
        <button onClick={() => {toggleSideBar()}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>
    </div>
}

export function AppLogo(){
    return <div>
        <div className='flex justify-start'>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </div>
            <div className='text-[25px] font-mono font-bold pt-[4px]'>
                Slate
            </div>
        </div>
    </div>
}
