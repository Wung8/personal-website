/**
 * A block of code in a write-up. Pass the code as text, e.g. a file imported
 * with `?raw`:  import move from './code/move.py?raw'  →  <CodeBlock>{move}</CodeBlock>
 */
export default function CodeBlock({ children }) {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  )
}
