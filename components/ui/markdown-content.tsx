import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MarkdownContentProps = {
  content: string;
  tone?: "light" | "dark";
  className?: string;
};

const baseMarkdownClasses =
  "break-words text-base leading-8 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition [&_a:hover]:opacity-80 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-5 [&_blockquote]:italic [&_code]:rounded-md [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.92em] [&_em]:italic [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-7 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:my-8 [&_hr]:border-t [&_img]:my-6 [&_img]:rounded-2xl [&_img]:border [&_img]:shadow-[0_16px_32px_-24px_var(--shadow)] [&_input[type='checkbox']]:mr-3 [&_input[type='checkbox']]:translate-y-[1px] [&_li]:my-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-[1.4rem] [&_pre]:border [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-2xl [&_tbody_tr]:border-t [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_thead]:text-sm [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6";

const toneClasses: Record<NonNullable<MarkdownContentProps["tone"]>, string> = {
  light:
    "text-slate-700 [&_a]:text-accent [&_blockquote]:border-accent/20 [&_blockquote]:text-slate-600 [&_code]:bg-slate-950/5 [&_code]:text-slate-900 [&_h1]:text-slate-950 [&_h2]:text-slate-950 [&_h3]:text-slate-950 [&_hr]:border-slate-900/10 [&_img]:border-slate-900/10 [&_pre]:border-slate-900/10 [&_pre]:bg-slate-950 [&_pre]:text-slate-100 [&_table]:border border-slate-900/10 [&_tbody_tr]:border-slate-900/10 [&_th]:bg-slate-950/5 [&_thead]:text-slate-500",
  dark:
    "text-slate-100 [&_a]:text-[#7eead8] [&_blockquote]:border-white/15 [&_blockquote]:text-slate-300 [&_code]:bg-white/10 [&_code]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_hr]:border-white/10 [&_img]:border-white/10 [&_pre]:border-white/10 [&_pre]:bg-black/25 [&_pre]:text-slate-100 [&_table]:border border-white/10 [&_tbody_tr]:border-white/10 [&_th]:bg-white/5 [&_thead]:text-slate-300",
};

type AnchorProps = ComponentPropsWithoutRef<"a"> & {
  href?: string;
};

export function MarkdownContent({
  content,
  tone = "light",
  className,
}: MarkdownContentProps) {
  return (
    <div className={cn(baseMarkdownClasses, toneClasses[tone], className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, ...props }: AnchorProps) => {
            const isExternal = href?.startsWith("http");

            return (
              <a
                {...props}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
