import { router, type Href } from 'expo-router';

/** Only same-app paths are followed after signing in; anything else (a link someone crafted) goes to Profile. */
export function safeNext(next: string | undefined): Href {
  return next && /^\/[A-Za-z0-9/_-]*$/.test(next) && !next.startsWith('//') ? (next as Href) : '/profile';
}

/** Leaves the sign-in screens for good: back to where the customer came from, with no way to "back" into the forms. */
export function finishSignIn(next: string | undefined) {
  if (router.canDismiss()) router.dismissAll();
  router.replace(safeNext(next));
}
