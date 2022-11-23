import '@fontsource/courier-prime/400.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/source-code-pro'
import 'react-day-picker/dist/style.css'
import React from 'react'
import axios from 'axios'
import Keycloak from 'keycloak-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { compact, flattenDeep, join, tail, takeRight } from 'lodash'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, LoaderFunctionArgs, RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout'
import Assignment from './pages/Assignment'
import Course from './pages/Course'
import CourseCreator from './pages/CourseCreator'
import Courses from './pages/Courses'
import Error from './pages/Error'
import Students from './pages/Students'
import Task from './pages/Task'
import theme from './Theme'
import Assignments from './pages/Assignments'

const authClient = new Keycloak({
  url: process.env.REACT_APP_AUTH_SERVER_URL || 'https://info1-staging.ifi.uzh.ch:8443',
  realm: 'access',
  clientId: 'access-frontend'
})

axios.defaults.baseURL = '/api/'
axios.interceptors.response.use(response => response.data)
const setAuthToken = (token?: string) => axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }

function App() {
  const { keycloak } = useKeycloak()

  if (!keycloak.token)
    return <></>

  setAuthToken(keycloak.token)
  const client = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })

  const fetchURL = (...path: any[]) => join(compact(flattenDeep(path)), '/')
  const setQuery = (...path: any[]) => client.setQueryDefaults(takeRight(path),
      { queryFn: context => axios.get(fetchURL(path, tail(context.queryKey))) })
  const setMutation = (...path: any[]) => client.setMutationDefaults(takeRight(path),
      { mutationFn: (data) => axios.post(fetchURL(path), data) })

  const loadCourses = () => setQuery('courses')
  const loadCreator = () => setMutation('courses')
  const loadCourse = ({ params }: LoaderFunctionArgs) => {
    setQuery('courses', params.courseURL, 'students')
    setMutation('courses', params.courseURL, 'students')
    setMutation('courses', params.courseURL, 'pull')
    setMutation('courses', params.courseURL, 'submit')
  }
  const loadAssignments = ({ params }: LoaderFunctionArgs) =>
      setQuery('courses', params.courseURL, 'assignments')
  const loadTasks = ({ params }: LoaderFunctionArgs) =>
      setQuery('courses', params.courseURL, 'assignments', params.assignmentURL, 'tasks')

  const router = createBrowserRouter([{
    path: '/', element: <Layout />, loader: loadCourses, errorElement: <Error />, children: [
      { index: true, element: <Courses /> },
      { path: 'create', loader: loadCreator, element: <CourseCreator /> },
      {
        path: 'courses/:courseURL', loader: loadCourse, children: [
          { index: true, element: <Course /> },
          { path: 'students', element: <Students /> },
          { path: 'assignments', element: <Assignments /> },
          {
            path: 'assignments/:assignmentURL', loader: loadAssignments, children: [
              { index: true, element: <Assignment /> },
              { path: 'tasks/:taskURL', loader: loadTasks, element: <Task /> }
            ]
          }
        ]
      }
    ]
  }])

  return (
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(
    <ReactKeycloakProvider authClient={authClient} initOptions={{ onLoad: 'login-required' }}
                           onTokens={({ token }) => setAuthToken(token)}>
      <ChakraProvider theme={theme}>
        <ColorModeScript />
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ChakraProvider>
    </ReactKeycloakProvider>)