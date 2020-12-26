import Link from 'next/link'
import React from 'react'

export const NodeLabel: React.FC<{ slug: string; name: string }> = ({
  slug,
  name,
}) => {
  return (
    <Link href={`/go/${slug}`}>
      <a
        className="bg-gray-100 rounded-md hover:bg-gray-200"
        style={{ padding: `2px 4px` }}
      >
        {' '}
        {name}
      </a>
    </Link>
  )
}
