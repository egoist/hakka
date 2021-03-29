import Markdown from 'markdown-it'

const isExternalLink = (url: string) => /^https?:\/\//.test(url)

export const renderMarkdown = (text: string) => {
  const md = new Markdown({
    html: false,
    linkify: true,
  })

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (token && isExternalLink(token.attrGet('href') || '')) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'nofollow noopener')
    }
    return self.renderToken(tokens, idx, env)
  }

  const html = md.render(text)
  return html
}
