import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Clean, modern heading styles
          h1: ({ children }) => (
            <div className="mb-6 mt-8 first:mt-0">
              <h1 className="text-xl font-bold text-foreground mb-3 flex items-center border-l-4 border-primary pl-4 bg-primary/5 py-2 rounded-r">
                {children}
              </h1>
            </div>
          ),
          h2: ({ children }) => (
            <div className="mb-4 mt-6 first:mt-0">
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center border-l-2 border-primary/70 pl-3 bg-secondary/30 py-2 rounded-r">
                {children}
              </h2>
            </div>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-foreground mb-3 mt-4 first:mt-0 text-primary">
              {children}
            </h3>
          ),
          
          // Clean paragraph styling
          p: ({ children }) => (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 last:mb-0">
              {children}
            </p>
          ),
          
          // Simple, clean list styling
          ul: ({ children }) => (
            <ul className="space-y-2 mb-4 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-4 ml-4 list-decimal">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-muted-foreground flex items-start">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="flex-1 leading-relaxed">{children}</span>
            </li>
          ),
          
          // Clean code styling
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-secondary/60 px-2 py-1 rounded text-xs font-mono text-foreground border border-border/50">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <div className="bg-secondary/40 p-4 rounded-lg border border-border/50 mb-4">
              <pre className="text-xs overflow-x-auto text-foreground">
                {children}
              </pre>
            </div>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-primary font-medium">{children}</em>
          ),
          
          // Clean table styling
          table: ({ children }) => (
            <div className="overflow-hidden rounded-lg border border-border/50 mb-6 bg-background">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-secondary/50 px-4 py-3 text-left text-xs font-semibold text-foreground border-b border-border/50">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-xs text-muted-foreground border-b border-border/30 last:border-b-0">
              {children}
            </td>
          ),
          
          // Clean blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/40 pl-4 py-2 mb-4 bg-secondary/20 rounded-r italic">
              <div className="text-sm text-muted-foreground">
                {children}
              </div>
            </blockquote>
          ),
          
          // Simple horizontal rule
          hr: () => (
            <div className="my-6 border-t border-border/50"></div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}