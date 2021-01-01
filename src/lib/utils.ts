export const stripHTML = (input: string) => {
  return input.replace(/(<([^>]+)>)/gi, '')
}
