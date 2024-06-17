import { atom } from 'recoil';

export const errorAtom = atom({
    key: 'errorAtom',
    default:{
        isError: false,
        issues: []
    }
})
