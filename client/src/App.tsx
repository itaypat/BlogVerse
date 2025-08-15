import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from './components/Layout'
import PostPage from './pages/PostPage'
import CreatePost from './pages/CreatePost'
import AllPosts from './pages/AllPosts'
import Chatbot from './pages/Chatbot'
import ProfilePage from './pages/ProfilePage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route 
            path='/' 
            element={
              <ProtectedRoute>
                <Layout>
                  <Home/>
                </Layout>
              </ProtectedRoute>
            }/>
          <Route 
            path='/posts' 
            element={
              <ProtectedRoute>
                <Layout>
                  <AllPosts/>
                </Layout>
              </ProtectedRoute>
            }/>
          <Route 
            path='/chat' 
            element={
              <ProtectedRoute>
                <Layout>
                  <Chatbot/>
                </Layout>
              </ProtectedRoute>
            }/>
          <Route 
            path='/create' 
            element={
              <ProtectedRoute>
                <Layout>
                  <CreatePost/>
                </Layout>
              </ProtectedRoute>
            }/>

          <Route 
            path='/post/:id' 
            element={
              <ProtectedRoute>
                <Layout>
                  <PostPage/>
                </Layout>
              </ProtectedRoute>
            }/>
          <Route 
            path='/profile/' 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage/>
                </Layout>
              </ProtectedRoute>
            }/>
          <Route 
            path='/profile/:id' 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage/>
                </Layout>
              </ProtectedRoute>
            }/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
