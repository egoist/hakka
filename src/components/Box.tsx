import React from 'react'

export const Box: React.FC<{}> = ({ children }) => {
  return (
    <div className="bg-white rounded-lg border border-border">{children}</div>
  )
}
