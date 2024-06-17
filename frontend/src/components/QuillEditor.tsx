import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { BACKEND_URL } from './config';

export default function QuillEditor(){
    const isSmallScreen = useMediaQuery('(max-width:640px)')
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    const publishPost = async() => {
        try {
            const response = await axios({
                url: `${BACKEND_URL}/api/v1/blog/publish`,
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('token')
                },
                data: {
                    title: title,
                    content: content,
                    isPublished: true
                }
            });

            if(response.status == 200){
                navigate('/blog');
            }

            console.log(response);

        } catch (err) {
            console.error(err);
        }
    }

    const saveDraft = async() => {
        try {
            const response = await axios({
                url: `${BACKEND_URL}/api/v1/blog/publish`,
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('token')
                },
                data: {
                    title: title,
                    content: content,
                    isPublished: false
                }
            });

            if(response.status == 200){
                navigate('/drafts');
            }
            
        } catch (err) {
            console.error('Error', err);
        }
    }

    return <div>
        <div className='flex md:justify-between'>
            <div>
                <input className='text-[25px] m-[10px] p-[5px] pl-[20px] w-[480px] border-[2px] border-gray-300 rounded-md font-serif text-black tracking-lighter'
                type='text' placeholder='Title' onChange={(e) => {
                    setTitle(e.target.value);
                }} />
            </div>
            <div className='p-[13px]'>
            {!isSmallScreen && 
                <SubmitData />
            }
            </div>
        </div>
        <div className='m-[10px]'>
            <ReactQuill theme='snow' value={content} onChange={setContent} />
        </div>
        <div>

        </div>
        <div>
            {isSmallScreen &&
                <SubmitData />
            }
        </div>
    </div>

    function SubmitData(){
        return <div className='flex justify-end gap-[20px] mx-[10px]'>
            <button onClick={saveDraft}>
                <div className='bg-slate-200 py-[7px] px-[10px] w-[120px] text-black font-medium border-[3px] border-black rounded-[25px] text-[18px]'>Save Draft</div>
            </button>
            <button onClick={publishPost}>
                <div className='bg-black py-[7px] px-[10px] w-[120px] text-white font-medium border-[3px] border-black rounded-[25px] text-[18px]'>Publish</div>
            </button>
        </div>
    }
}