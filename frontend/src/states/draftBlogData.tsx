import { atom } from 'recoil';

export const draftBlogDataAtom = atom({
    key: 'draftBlogDataAtom',
    default:{
        id: '',
        title: '',
        content: ''
    }
});
