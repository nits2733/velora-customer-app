/**
 * The password-reset token, handed from the code screen to the new-password screen. Kept in memory
 * only: it is a credential, so it does not go into the URL, storage or analytics.
 */
let resetToken: string | null = null;

export const authFlow = {
  setResetToken(token: string) {
    resetToken = token;
  },
  takeResetToken(): string | null {
    return resetToken;
  },
  clear() {
    resetToken = null;
  },
};
