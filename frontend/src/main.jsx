import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'

import App from './App.jsx'
import Home from './pages/HomePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CollectionsPage from './pages/CollectionsPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import ReadingListsPage from './pages/ReadingListsPage.jsx'
import ReadingSheetsPage from './pages/ReadingSheetsPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import BookCardWrapper from './components/BookCardWrapper.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/favorites',
        element: <FavoritesPage />
      },
      {
        path: '/collections',
        element: <CollectionsPage />
      },
      {
        path: '/reading-lists',
        element: <ReadingListsPage />
      },
      {
        path: '/reading-sheet',
        element: <ReadingSheetsPage />
      },
      {
        path: '/search',
        element: <SearchPage />
      },
      {
        path: '/book/:isbn',
        element: <BookCardWrapper />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
)

