import { useEffect } from 'react';

/** usePageTitle — sets the browser tab title, e.g. "Reviews · YallaWin". */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · YallaWin` : 'YallaWin';
  }, [title]);
}