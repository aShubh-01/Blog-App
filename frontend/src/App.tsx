import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './App.css';

const Signup = React.lazy(() => import('./components/pages/Signup'));
const Signin = React.lazy(() => import('./components/pages/Signin'));
const Blog = React.lazy(() => import('./components/pages/Blogs'));
const ReadBlog = React.lazy(() => import('./components/pages/ReadBlog'));
const WriteBlog = React.lazy(() => import('./components/pages/WriteBlog'));
const DraftBlogs = React.lazy(() => import('./components/pages/DraftBlogs'));
const SavedBlogs = React.lazy(() => import('./components/pages/SavedBlogs'));

function App() {

  return (
    <>
     <RecoilRoot>
       <BrowserRouter>
          <Suspense fallback='Loading...'>
            <Routes>
              <Route path='/signup' element={<Signup />}/>
              <Route path='/signin' element={<Signin />}/>
              <Route path='/blogs' element={<Blog />}/>
              <Route path='/read' element={<ReadBlog />} />
              <Route path='/write' element={<WriteBlog /> } />
              <Route path='/drafts' element={<DraftBlogs />}/>
              <Route path='/saved' element={<SavedBlogs />}/> 
            </Routes>
          </Suspense>
        </BrowserRouter>
     </RecoilRoot>
    </>
  )
}

export default App
