import React from 'react'
import { Link } from 'react-router-dom'

export const NodeLabel: React.FC<{ slug: string; name: string }> = ({
  slug,
  name,
}) => {
  return (
    <Link
      className="bg-gray-100 rounded-md hover:bg-gray-200"
      style={{ padding: `2px 4px` }}
      to={`/go/${slug}`}
    >
      {name}
    </Link>
  )
}
