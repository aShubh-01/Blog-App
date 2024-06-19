import { AppBar } from '../AppBar';
import { SideBar } from '../SideBar';
import { useEffect } from 'react';
import { sidebarAtom } from '../../states/sidebar';
import { useRecoilState } from 'recoil';
import QuillEditor from '../QuillEditor';

export default function(){
    const [sideBar, setSideBar] = useRecoilState(sidebarAtom)

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
        <div>
            <QuillEditor />
        </div>
    </div>
}