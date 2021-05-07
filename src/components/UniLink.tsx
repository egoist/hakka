import Link from 'next/link'
import React from 'react'

const isExternal = (url: string) =>
  /^https?:\/\//.test(url) || /^mailto:/.test(url)

export const UniLink: React.FC<
  { to: string } & React.HTMLAttributes<HTMLAnchorElement>
> = ({ to, children, ...props }) => {
  if (isExternal(to)) {
    return (
      <a href={to} target="_blank" rel="noopener nofollow" {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link href={to}>
      <a {...props}>{children}</a>
    </Link>
  )
}
