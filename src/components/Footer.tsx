export const Footer = () => {
  return (
    <footer className="text-xs text-gray-400 py-10 border-t border-border">
      <div className="container">
        <div className="space-x-3">
          <span>&copy; HAKKA!</span>
          <a
            href="https://github.com/egoist/hakka"
            target="_blank"
            className="hover:text-gray-600 transition"
          >
            获取开源代码
          </a>
        </div>
      </div>
    </footer>
  )
}
