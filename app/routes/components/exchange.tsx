import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export const Exchange: React.FC<{ token: string | null; action: any }> = ({
  token,
  action,
}) => {
  const fetcher = useFetcher();

  const exchangeToken = () => {
    fetcher.submit(
      { public_token: token },
      { method: "post", action: process.env.URL + "/exchange-public-token" },
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.accessToken) {
        action(fetcher.data.accessToken);
      } else if (fetcher.data.error) {
        console.error("Error exchanging token:", fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data, action]);

  return (
    <button
      onClick={() => exchangeToken()}
      disabled={!token}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      {token ? "Exchange Public Token" : "Run Plaid Link First"}
    </button>
  );
};
