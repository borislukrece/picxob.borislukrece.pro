interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: Record<string, unknown>) => void;
        renderButton: (element: HTMLElement | null, options: Record<string, unknown>) => void;
        prompt: () => void;
        revoke: (token: string | null, callback: (done: unknown) => void) => void;
        disableAutoSelect: () => void;
      };
    };
  };
}
