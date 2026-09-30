/** Triggers a client-side text download. */
export function downloadTextFile(filename, contents) {
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  setTimeout(() => URL.revokeObjectURL(url), 0)
}

/** `dog-in-park.jpg` -> `dog-in-park` */
export function stripExtension(filename = 'image') {
  const index = filename.lastIndexOf('.')
  return index === -1 ? filename : filename.slice(0, index)
}
