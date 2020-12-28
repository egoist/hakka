// Modified from https://github.com/sindresorhus/is-url-superb/blob/master/index.js
export const parseURL = (str: string) => {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string')
  }

  str = str.trim()
  if (str.includes(' ')) {
    return null
  }

  try {
    return new URL(str)
  } catch {
    return null
  }
}
