import React from 'react'
import { useHistory } from 'react-router-dom'
import { Header } from '@src/components/Header'
import { Spinner } from '@src/components/Spinner'
import { useStore } from '@src/lib/store'

export const LoginSuccessPage = () => {
  const history = useHistory()
  const login = useStore((state) => state.login)
  React.useEffect(() => {
    const token = location.hash.replace('#', '')
    if (!token) {
      alert('Error!')
    }
    login(token)
    console.log('Redirecting back to home')
    history.replace(`/`)
  }, [])
  return (
    <div>
      <Header />
      <div className="main">
        <div className="container">
          <div className="flex items-center justify-center mt-10">
            <Spinner color="text-red-700" /> 登录成功
          </div>
        </div>
      </div>
    </div>
  )
}
