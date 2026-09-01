import { useEffect } from 'react';
import type { CmsData } from './types';
import { applyHead, type HeadInput } from './seo';
import { pageView } from './analytics';

/** Applies <head> tags for the current route and fires a page_view. */
export function useHead(input: HeadInput, d: CmsData) {
  const key = JSON.stringify([input.title, input.description, input.path, input.index, input.canonical, input.ogImage]);
  useEffect(() => {
    applyHead(input, d);
    pageView(input.path, input.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
