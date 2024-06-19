import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../components/config';

export function useGetSavedBlogs(){
    const [savedBlogs, setSavedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            axios({
                url: `${BACKEND_URL}/api/v1/blog`,
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('token')
                }
            }).then((res) => {
                setLoading(false);
                setSavedBlogs(res.data.savedPosts.savedPosts);
            });

        } catch (err) {
            console.error(err);
        }
    }, []);

    return {
        savedBlogs,
        loading
    }
}

export function useGetBlog(postId: any){
    const [blog, setBlog] = useState();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            axios({
                url: 'http://localhost:8787/api/v1/blog/' +postId,
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : localStorage.getItem('token')
                }
            }).then((res) => {
                setBlog(res.data.blog);
                setLoading(false);
            });

        } catch (err) {
            console.log(err);
        }
    }, []);

    return {
        loading,
        blog
    }
}

export function useGetAllBlogs(){
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        try {
            axios({
                url: `${BACKEND_URL}/api/v1/blog/bulk`,
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('token')
                }
            }).then((res) => {
                setLoading(false);
                setBlogs(res.data.allBlogs);
            });

        } catch (err) {
            console.error(err);
        }
    }, []);

    return {
        loading,
        blogs
    }
}

export function useGetDraftBlogs(){
    const [loading, setLoading] = useState(true);
    const [drafts, setDrafts] = useState([]);

    try {
        useEffect(() => {
            axios({
                url: `${BACKEND_URL}/api/v1/blog/drafts`,
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('token')
                }
            }).then((response) => {
                setLoading(false);
                setDrafts(response.data.drafts);
            });
        }, []);

    } catch (err) {
        console.log(err);
    }

    return {
        loading,
        drafts
    }
}