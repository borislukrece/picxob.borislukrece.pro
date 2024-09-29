export interface FetcherConfig extends RequestInit {
    headers?: HeadersInit;
  }
  
  export const fetcher = async (url: string, options: FetcherConfig = {}) => {
    const savedToken = localStorage.getItem("userToken");

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${savedToken || ""}`,
    };
  
    const config: FetcherConfig = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
  
    try {
      const response = await fetch(url, config);
  
      if (!response.ok) {
        const errorDetails = await response.json();
        if(errorDetails.status === 401){
            localStorage.removeItem("userToken");
            localStorage.removeItem("user");
            if (typeof window !== "undefined" && window.google) {
              window.google.accounts.id.revoke(savedToken, () => {
                console.log("User disconnected.");
              });
              window.google.accounts.id.disableAutoSelect();
              window.location.reload();
            }
        }
        throw new Error(errorDetails.message || "An error occurred");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Fetch error: ", error);
      throw error;
    }
  };
  