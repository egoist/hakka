import Markdown from 'markdown-it'

export const renderMarkdown = (text: string) => {
  const md = new Markdown({
    html: false,
    linkify: true,
  })
  const html = md.render(text)
  return html
}
