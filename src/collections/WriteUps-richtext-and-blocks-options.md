# Write-Ups Description: Lexical Rich Text vs Blocks Field

Two ways to support **text + code blocks** in the write-ups `description` field. Pick one and apply it to `WriteUps.ts`; then run `pnpm run generate:types` and update your frontend renderer.

---

## Option 1: Lexical Rich Text Editor (with Code Block)

**Best for:** One flowing document where authors type normally and insert code blocks inline (e.g. via slash menu or toolbar). Single field, one JSON tree.

### 1.1 Collection config

In `WriteUps.ts`, replace the `description` field and ensure the editor is configured at least for this field:

```ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor, BlocksFeature, CodeBlock } from '@payloadcms/richtext-lexical'

export const WriteUps: CollectionConfig = {
  slug: 'write-ups',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Heading' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { description: 'URL path, e.g. "my-first-write-up" → /write-ups/my-first-write-up' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      label: 'Date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'author', type: 'text', required: true, label: 'Author' },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Description',
      admin: {
        description: 'Full content shown when user opens the write-up. Use the block menu to add code blocks.',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [CodeBlock()],
          }),
        ],
      }),
    },
  ],
}
```

- **Root editor:** If your `payload.config.ts` already has `editor: lexicalEditor()`, the field’s `editor` above extends it with the Code block. If you prefer to enable Code only for this collection, the same `lexicalEditor({ features: (...) => [...defaultFeatures, BlocksFeature({ blocks: [CodeBlock()] })] })` can live here and you don’t need to change the root config.
- **CodeBlock** is the premade block from `@payloadcms/richtext-lexical`; slug is `'Code'`, with `language` (select) and `code` (code field).

### 1.2 TypeScript schema (after `generate:types`)

Payload does not generate a fully narrowed type for Lexical rich text; it usually types the field as a generic structure. You can treat the stored value as Lexical editor state and type it with the package’s types:

```ts
// In your frontend or shared types
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import type { SerializedBlockNode } from '@payloadcms/richtext-lexical'

// Block node for the Code block (blockType is the block slug)
export interface SerializedCodeBlockPayload {
  blockType: 'Code'
  fields: {
    language: string
    code: string
  }
}

export type WriteUpDescriptionNode = SerializedLexicalNode | SerializedBlockNode<SerializedCodeBlockPayload>

export type WriteUpDescription = SerializedEditorState<WriteUpDescriptionNode>
```

- **Stored value:** `description: WriteUpDescription | null` (root has `root: { children: [...] }`).
- **Paragraphs/text:** Standard Lexical nodes (`paragraph`, `text`, etc.).
- **Code blocks:** A node whose `type` is the block node type and whose payload includes `blockType: 'Code'` and `fields: { language, code }`. Use `@payloadcms/richtext-lexical`’s `SerializedBlockNode` (or the package’s equivalent) for that node shape.

So the **exact schema** you rely on is:

- **Root:** `{ root: { type: 'root', children: SerializedLexicalNode[], ... } }`
- **Code block (block):** payload with `blockType: 'Code'`, `fields: { language: string, code: string }`.

### 1.3 Frontend rendering (conceptual)

- Walk the `root.children` array.
- For each node, switch on `node.type`: render paragraphs, headings, lists, etc. as usual.
- For the block node that carries the Code block, check `blockType === 'Code'` and render `<pre><code data-language={fields.language}>{fields.code}</code></pre>` (or use a highlighter with `fields.language`).
- You can use Payload’s Lexical-to-HTML or a small custom tree walker; the important part is handling the Code block payload as above.

---

## Option 2: Blocks Field (Text + Code blocks only)

**Best for:** Strict “paragraph then code then paragraph” control. Each item is either a text block or a code block; no inline formatting inside text, but structure is very clear and the TypeScript schema is explicit.

### 2.1 Block definitions (shared)

Define two blocks and reuse them in the collection. Create `src/blocks/TextBlock.ts` and `src/blocks/CodeBlock.ts` (or colocate in the same file as the collection).

```ts
// src/blocks/TextBlock.ts
import type { Block } from 'payload'

export const TextBlock: Block = {
  slug: 'text',
  labels: { singular: 'Text', plural: 'Text' },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Content',
    },
  ],
}
```

```ts
// src/blocks/CodeBlock.ts (custom block for Blocks field – not the Lexical premade)
import type { Block } from 'payload'

export const CodeBlock: Block = {
  slug: 'code',
  labels: { singular: 'Code', plural: 'Code' },
  fields: [
    {
      name: 'language',
      type: 'select',
      label: 'Language',
      defaultValue: 'plaintext',
      options: [
        { label: 'Plain Text', value: 'plaintext' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'Bash', value: 'bash' },
        { label: 'JSON', value: 'json' },
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
      ],
    },
    {
      name: 'code',
      type: 'code',
      required: true,
      label: 'Code',
    },
  ],
}
```

### 2.2 Collection config

In `WriteUps.ts` (adjust block imports if you put them elsewhere):

```ts
import type { CollectionConfig } from 'payload'
import { TextBlock } from '@/blocks/TextBlock'
import { CodeBlock } from '@/blocks/CodeBlock'

export const WriteUps: CollectionConfig = {
  slug: 'write-ups',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Heading' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { description: 'URL path, e.g. "my-first-write-up" → /write-ups/my-first-write-up' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      label: 'Date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'author', type: 'text', required: true, label: 'Author' },
    {
      name: 'description',
      type: 'blocks',
      required: true,
      label: 'Description',
      minRows: 1,
      blocks: [TextBlock, CodeBlock],
      admin: {
        description: 'Full content. Add Text and Code blocks in order (Text → Code → Text → Code).',
      },
    },
  ],
}
```

### 2.3 TypeScript schema (exact, after `generate:types`)

Payload will generate something equivalent to:

```ts
// Generated (or define manually if you don’t run generate:types yet)
export interface TextBlock {
  blockType: 'text'
  content: string
}

export interface CodeBlock {
  blockType: 'code'
  language: 'plaintext' | 'typescript' | 'javascript' | 'python' | 'bash' | 'json' | 'html' | 'css'
  code: string
}

export type WriteUpDescriptionBlock = TextBlock | CodeBlock

export interface WriteUp {
  id: string
  title: string
  slug: string
  publishedDate: string
  author: string
  description: WriteUpDescriptionBlock[]
  updatedAt: string
  createdAt: string
}
```

So the **exact schema** for the description field is:

- **Type:** `WriteUpDescriptionBlock[]`
- **Each element:** either `{ blockType: 'text', content: string }` or `{ blockType: 'code', language: string, code: string }`.

### 2.4 Frontend rendering (conceptual)

```tsx
function RenderDescription({ blocks }: { blocks: WriteUpDescriptionBlock[] }) {
  return (
    <div className="write-up-body">
      {blocks.map((block, i) => {
        if (block.blockType === 'text') {
          return <p key={i}>{block.content}</p>
        }
        return (
          <pre key={i}>
            <code data-language={block.language}>{block.code}</code>
          </pre>
        )
      })}
    </div>
  )
}
```

You can add a syntax highlighter (e.g. Prism, Shiki) using `block.language` and `block.code`.

---

## Comparison

| Aspect | Option 1: Lexical Rich Text | Option 2: Blocks field |
|--------|----------------------------|-------------------------|
| **Data shape** | Single Lexical JSON tree (`root.children`) | Array of `{ blockType, ...fields }` |
| **Editing UX** | Inline formatting (bold, links, etc.) + insert Code block in flow | Add “Text” or “Code” block; no inline formatting in text |
| **Typing** | Use Lexical + `SerializedBlockNode` for Code; root is editor state | Strong, explicit union type per block (e.g. `TextBlock \| CodeBlock`) |
| **Rendering** | Walk Lexical tree; handle block node for Code | Iterate array; switch on `blockType` |
| **Migration** | Existing `description` (textarea) is plain string → need migration or new content | Same; existing data is string → need migration or new content |

Use **Option 1** if you want a single rich-text document with inline formatting and code blocks. Use **Option 2** if you want a strict, predictable sequence of text and code blocks with the simplest possible TypeScript and rendering.

After choosing, update `WriteUps.ts`, run `pnpm run generate:types`, then implement the corresponding renderer on the frontend (and add a migration for existing `description` values if necessary).
