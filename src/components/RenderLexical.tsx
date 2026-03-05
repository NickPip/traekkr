import React from 'react'

/**
 * Lexical editor state (root node).
 * Payload stores richText as { root: { type: 'root', children: SerializedLexicalNode[] } }.
 */
interface LexicalRoot {
  root: {
    type: string
    children?: LexicalNode[]
    [key: string]: unknown
  }
}

interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
  mode?: string
  fields?: {
    blockType?: string
    code?: string
    language?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

function getTextFromNode(node: LexicalNode): string {
  if (node.type === 'text' && typeof node.text === 'string') return node.text
  if (Array.isArray(node.children))
    return node.children.map(getTextFromNode).join('')
  return ''
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  const key = `node-${index}`

  if (node.type === 'block' && node.fields?.blockType === 'Code') {
    const code = node.fields?.code ?? ''
    const language = node.fields?.language ?? 'plaintext'
    return (
      <pre key={key} className="traekkr-popup-code">
        <code data-language={language}>{code}</code>
      </pre>
    )
  }

  if (node.type === 'paragraph') {
    const content = Array.isArray(node.children)
      ? node.children.map((child, i) => renderNode(child, i))
      : null
    return <p key={key} className="traekkr-popup-description">{content}</p>
  }

  if (node.type === 'heading') {
    const tag = (`h${(node as LexicalNode & { tag?: string }).tag ?? 2}`) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    const content = Array.isArray(node.children)
      ? node.children.map((child, i) => renderNode(child, i))
      : null
    return React.createElement(tag, { key, className: 'traekkr-popup-heading' }, content)
  }

  if (node.type === 'list') {
    const ListTag = (node as LexicalNode & { listType?: string }).listType === 'number' ? 'ol' : 'ul'
    const content = Array.isArray(node.children)
      ? node.children.map((child, i) => renderNode(child, i))
      : null
    return (
      <ListTag key={key} className="traekkr-popup-list">
        {content}
      </ListTag>
    )
  }

  if (node.type === 'listitem') {
    const content = Array.isArray(node.children)
      ? node.children.map((child, i) => renderNode(child, i))
      : null
    return <li key={key}>{content}</li>
  }

  if (node.type === 'text') {
    const text = node.text ?? ''
    // Optional: wrap in link if parent is link; for now keep simple
    return <React.Fragment key={key}>{text}</React.Fragment>
  }

  if (node.type === 'link') {
    const url = (node as LexicalNode & { url?: string }).url ?? '#'
    const content = Array.isArray(node.children)
      ? node.children.map((child, i) => renderNode(child, i))
      : null
    return (
      <a key={key} href={url} className="traekkr-popup-link-inline" target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  if (node.type === 'quote') {
    const content = Array.isArray(node.children)
      ? node.children.map((child, i) => renderNode(child, i))
      : null
    return (
      <blockquote key={key} className="traekkr-popup-quote">
        {content}
      </blockquote>
    )
  }

  if (node.type === 'linebreak') {
    return <br key={key} />
  }

  // Fallback: render children as fragment or single paragraph
  if (Array.isArray(node.children) && node.children.length > 0) {
    return (
      <React.Fragment key={key}>
        {node.children.map((child, i) => renderNode(child, i))}
      </React.Fragment>
    )
  }

  const text = getTextFromNode(node)
  if (text) return <React.Fragment key={key}>{text}</React.Fragment>

  return null
}

interface RenderLexicalProps {
  /** Lexical rich text value from Payload (root object) */
  content: LexicalRoot | null | undefined
}

/**
 * Renders Payload Lexical rich text (including Code blocks) as React nodes.
 * Use on the write-up single page for the description field.
 */
export function RenderLexical({ content }: RenderLexicalProps) {
  if (!content?.root?.children?.length) {
    return null
  }

  const children = content.root.children.map((node, index) => renderNode(node, index))

  return <div className="traekkr-popup-body-content">{children}</div>
}
