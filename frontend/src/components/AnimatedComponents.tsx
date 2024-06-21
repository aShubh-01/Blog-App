import { useEffect, useRef} from 'react';
import lottie from 'lottie-web';
import LoadBlogAnimationData from '../assets/animations/LoadBlogs.json';
import SearchLoadAnimationData from '../assets/animations/SearchLoading1.json';
import LoadReadAnimationData from '../assets/animations/LoadRead.json';
import ButtonLoadingAnimationData from '../assets/animations/ButtonLoading.json';
import PublishLoadingAnimationData from '../assets/animations/PublishLoading.json';
import SaveDraftLoadingAnimationData from '../assets/animations/SaveDraftLoading.json'

const LoadAnimation = ({animationData}: {animationData: any}) => {
    const container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if(container.current){
            lottie.loadAnimation({
                container: container.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData
                
            });
        }
        
    }, []);

    return <div ref={container} />
}

export const LoadBlogs = () => {
    return <LoadAnimation animationData={LoadBlogAnimationData}/>
}

export const SearchBlogs = () => {
    return <LoadAnimation animationData={SearchLoadAnimationData} />
} 

export const LoadRead = () => {
    return <div className=''>
        <LoadAnimation animationData={LoadReadAnimationData} />
    </div>
}

export const SignLoading = () => {
    return <div className='ml-[155px]'>
        <LoadAnimation animationData={ButtonLoadingAnimationData} />
    </div>
}

export const LoadPublish = () => {
    return <div>
        <LoadAnimation animationData={PublishLoadingAnimationData}/>
    </div>
}

export const LoadSaveDraft = () => {
    return <div className=''>
        <LoadAnimation animationData={SaveDraftLoadingAnimationData}/>
    </div>
}