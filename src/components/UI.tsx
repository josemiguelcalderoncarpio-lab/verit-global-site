// src/components/UI.tsx
import Image from "next/image";
import type { ReactNode, HTMLAttributes } from "react";

/** SECTION **/
type SectionProps = HTMLAttributes<HTMLElement> & {
  title: string;                // visible heading text
  subtitle?: ReactNode;         // optional supporting line
  hideTitle?: boolean;          // render section without the heading block
};

export function Section({
  title,
  subtitle,
  hideTitle,
  children,
  className = "",
  id,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      {...rest}
      className={`bg-white py-10 sm:py-12 md:py-16 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {!hideTitle && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** CARD **/
type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;               // optional header
  children: ReactNode;
};

export function Card({ title, children, className = "", ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      {title ? (
        <p className="text-lg font-semibold text-slate-900">{title}</p>
      ) : null}
      <div className={`${title ? "mt-4" : ""} text-[15px] leading-7 text-slate-700 sm:text-base`}>
        {children}
      </div>
    </div>
  );
}

/** THREE-UP GALLERY **/
export function ThreeUpGallery({
  items,
  className = "",
  ...rest
}: {
  items: { src: string; caption: string }[];
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={`grid gap-4 sm:grid-cols-3 ${className}`}>
      {items.map((it, i) => (
        <figure
          key={i}
          className="group relative overflow-hidden rounded-xl ring-1 ring-slate-200"
        >
          <div className="relative aspect-[4/3]">
            <Image
              src={it.src}
              alt={it.caption}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <figcaption className="p-3 text-center text-xs text-slate-600">
            {it.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** CODE PANEL (copy/paste-safe, optional title) **/
type CodePanelProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  children: ReactNode;
};

export function CodePanel({
  title,
  children,
  className = "",
  ...rest
}: CodePanelProps) {
  return (
    <div
      {...rest}
      className={`rounded-xl border border-slate-200 bg-slate-50 p-3 ${className}`}
    >
      {title ? (
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </div>
      ) : null}
      <pre className="whitespace-pre-wrap text-[13px] leading-6 text-slate-800">
        {children}
      </pre>
    </div>
  );
}
