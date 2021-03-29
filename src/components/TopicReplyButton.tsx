import React from 'react'

export const TopicReplyButton: React.FC<{
  onClick: () => void
}> = ({ onClick }) => {
  return (
    <button
      className="inline-flex items-center px-2 h-7 rounded-md transition hover:text-orange-600 hover:bg-opacity-10 hover:bg-orange-100 focus:outline-none"
      onClick={onClick}
    >
      <svg focusable="false" width="1em" height="1em" viewBox="0 0 20 20">
        <g fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.707 3.293a1 1 0 0 1 0 1.414L5.414 7H11a7 7 0 0 1 7 7v2a1 1 0 1 1-2 0v-2a5 5 0 0 0-5-5H5.414l2.293 2.293a1 1 0 1 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z"
            fill="currentColor"
          ></path>
        </g>
      </svg>
      <span className="ml-1">回复</span>
    </button>
  )
}
