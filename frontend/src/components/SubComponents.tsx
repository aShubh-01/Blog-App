import { Link } from 'react-router-dom';

type HeaderType = {
    title: string,
    description: string,
    hLink: string,
    link: string
}

export function Header({title, description, hLink, link}: HeaderType) {
    return <div>
        <h4 className='font-semibold font-sans text-[40px]'>{title}</h4>
        <p className='flex justify-center gap-[5px] text-[20px] text-[#5A5C6F] font-normal'>{description} <Link className='font-black font-medium' to={hLink}>{link}</Link></p>
    </div>
}

type InputType = {
    title: string,
    type: string,
    placeholder: string,
    setProperty: (e: string) => void
}

export function InputField({title, type, placeholder, setProperty}: InputType){
    return <div>
        <h4 className='p-[2px] m-[2px] text-[20px] font-sans font-medium'>{title}</h4>
        <input className='pl-[15px] ml-[3px] h-[50px] w-[370px] text-[20px] font-medium rounded-md border-black border-[2px]' 
        type={type} placeholder={placeholder} onChange={(e) => {
            setProperty(e.target.value);
        }}/>
    </div>
}

type ButtonType = {
    title: string,
    onClickEvent: () => void
}

export function Button({title, onClickEvent}: ButtonType){
    return <div>
        <button className='h-[50px] w-[370px] bg-black text-[20px] font-medium text-white rounded-lg'
        onClick={onClickEvent}>
            {title}
        </button>
    </div>
}

type QuoteType = {
    quote: string,
    author: string,
    authorInfo: string
}

export function Quote({quote, author, authorInfo}: QuoteType){
    return <div>
        <h4 className='my-[10px] w-[700px] text-start font-semibold font-sans text-center text-[30px]'>"{quote}"</h4>
        <strong className='text-[20px]'>{author}</strong>
        <div className='text-[18px]'>{authorInfo}</div>
    </div>
}

export function LogIssues({issues}: {issues: string[]}) {
    let key = 1;
    return <div>
        {
            issues.map((issue) => {
                return <p key={key++} className='text-red-500 text-[17px] font-medium'>• {issue}</p>
            })
        }
    </div>
}

export function AvatarIcon({avatar}: {avatar: string}){
    return <div className='h-[40px] w-[40px] text-[25px] rounded-2xl bg-gray-300 text-center'>
        {avatar.toUpperCase()}
    </div>
}