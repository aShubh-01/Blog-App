import { Header, InputField, Button, Quote, LogIssues } from '../SubComponents'; 
import { errorAtom } from '../../states/errorHandling';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function Signin(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [log, setLog] = useRecoilState(errorAtom);

    useEffect(() => {
        setLog({isError: false, issues: []});
    }, []);

    return <div className='lg:flex justify-between'>
        <div className='ml-[140px] lg:ml-[250px]'>
            <div className='w-[400px] mt-[150px] border-2 border-black rounded-xl'>
                <div className='my-[20px] flex justify-center text-center'><Header  title="Log In" description="Dont have an account?" link="Signup" hLink="/signup" /></div>
                <div className='my-[5px] flex justify-center'><InputField title="Username" type='text' placeholder="Eg. Johnny" setProperty={setUsername} /></div>
                <div className='my-[5px] flex justify-center'><InputField title="Password" type='password' placeholder="Minimum 6 characters" setProperty={setPassword} /></div>
                {log.isError && 
                    <div className='mx-[15px] flex justify-center'>
                        <LogIssues issues={log.issues}/>
                    </div>
                }
                <div className='mt-[10px] mb-[10px] flex justify-center'><Button title="Sign Up" onClickEvent={() => {
                        setLog
                        axios({
                            url: `${BACKEND_URL}/api/v1/user/signin`,
                            method: 'POST',
                            headers: {
                                'Content-Type': "application/json"
                            },
                            data: {
                                name: username,
                                password: password
                            }
                        }).then((response) => {
                            if(response.status == 200){
                                localStorage.setItem('token', response.data.token);
                                localStorage.setItem('username', username);
                                navigate('/blogs');
                            }
                        }).catch((err) => {
                            console.log(err);
                            const issues = err.response.data.msg;
                            setLog((prevData) => (
                                {...prevData, isError: true, issues: issues}
                            ));
                        });
                }}/></div>
                </div>
            </div>
            <div className='invisible lg:visible  bg-gray-300 h-screen w-[1000px]'>
                <div className='my-[275px] ml-[200px]'>
                    <Quote 
                        quote="The Customer service i received was exceptional. The support team went above and beyond to address my concerns."
                        author="Jules Winnfiled"
                        authorInfo="CEO, Acme Inc"
                    />
                </div>
            </div>
    </div>
}