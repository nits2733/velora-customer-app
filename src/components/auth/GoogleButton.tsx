import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { googleConfig, type GoogleConfig } from '@/config/google';
import { strings } from '@/content/strings';

WebBrowser.maybeCompleteAuthSession();

interface Props {
  onIdToken: (idToken: string) => void;
  onFailure: () => void;
}

function Inner({ config, onIdToken, onFailure }: Props & { config: GoogleConfig }) {
  const [request, response, prompt] = Google.useIdTokenAuthRequest({
    clientId: config.webClientId,
    iosClientId: config.iosClientId,
    androidClientId: config.androidClientId,
  });
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!response || handled.current === (response as { type: string }).type + JSON.stringify(response)) return;
    handled.current = response.type + JSON.stringify(response);
    if (response.type === 'success' && response.params.id_token) onIdToken(response.params.id_token);
    else if (response.type === 'error') onFailure();
  }, [response, onIdToken, onFailure]);

  return <Button label={strings.auth.google.button} variant="quiet" onPress={() => request && prompt()} />;
}

/** Renders nothing until Google client IDs are configured, so there is never a sign-in option that cannot work. */
export function GoogleButton(props: Props) {
  return googleConfig ? <Inner config={googleConfig} {...props} /> : null;
}
