import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Custom wrapper around Next.js useRouter that automatically
 * triggers the nprogress loading bar for client-side navigation
 * since nextjs-toploader doesn't natively catch router.push().
 */
export function useNavigation() {
  const router = useRouter();

  const push = (href: string, options?: NavigateOptions) => {
    NProgress.start();
    router.push(href, options);
  };

  const replace = (href: string, options?: NavigateOptions) => {
    NProgress.start();
    router.replace(href, options);
  };

  return {
    ...router,
    push,
    replace,
  };
}
