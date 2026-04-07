import { useEffect } from "react";

type PageMeta = {
  title: string;
  description: string;
  canonical: string;
};

function setMeta(name: string, value: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Updates document.title, description, canonical, and OG/Twitter tags.
 * Use in pages that aren't the home route so legal pages don't inherit
 * generic home metadata.
 */
export function usePageMeta({ title, description, canonical }: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    setMeta("description", description);
    setLink("canonical", canonical);

    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, canonical]);
}
