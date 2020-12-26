import React from 'react'
import { Sidebar } from './Sidebar'

export const MainLayout: React.FC = ({ children }) => {
  return (
    <div className="main">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">{children}</div>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
