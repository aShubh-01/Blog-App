import { Header, InputField, Button, LogIssues } from '../SubComponents'; 
import { errorAtom } from '../../states/errorHandling';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { SignLoading } from '../AnimatedComponents';

export default function Signup(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(' ');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useRecoilState(errorAtom);

    const ButtonInnerHTMl = <div>Sign Up</div>;
    const [buttonContent, setButtonContent] = useState(ButtonInnerHTMl);

    useEffect(() => {
        setError({isError: false, issues: []});
    }, []);

    const handleSignUp = () => {
        setButtonContent(<SignLoading/>);
        axios({
            url: `${BACKEND_URL}/api/v1/user/signup`,
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                name: username,
                email: email,
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
            setError((prevData) => (
                {...prevData, isError: true, issues: issues}
            ));

        }).finally(() => {
            setButtonContent(ButtonInnerHTMl);
        });
    }

    return <div className='flex justify-center'>
            <div className='w-[400px] mt-[150px] border-2 border-black rounded-xl'>
                <div className='my-[20px] flex justify-center'><Header  title="Create an account" description="Already have an account?" link="Login" hLink="/" /></div>
                <div className='my-[5px] flex justify-center'><InputField title="Username" type='text' placeholder="Eg. Johnny" setProperty={setUsername} /></div>
                <div className='my-[5px] flex justify-center'><InputField title="Email" type='text' placeholder="Eg. John@gmail.com" setProperty={setEmail} /></div>
                <div className='my-[5px] flex justify-center'><InputField title="Password" type='text' placeholder="Minimum 6 characters" setProperty={setPassword} /></div>
                {error.isError && 
                    <div className='mx-[15px] flex justify-center'>
                        <LogIssues issues={error.issues}/>
                    </div>
                }
                <div className='mt-[10px] mb-[10px] flex justify-center'><Button buttonContent={buttonContent} onClickEvent={handleSignUp}/></div>
                </div>
    </div>
}