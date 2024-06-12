import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";
import { LinkButton } from "~/components/link-button";
import { ExchangeButton } from "~/components/exchange-button";

interface LoaderData {
  token: string;
}

export const loader: LoaderFunction = async () => {
  const response = await fetch(process.env.URL + "/api/get-public-token");
  const data = await response.json();
  return json<LoaderData>(data);
};

export default function Index() {
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const { token } = useLoaderData<LoaderData>();

  const copyAccessToken = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
    }
  };

  return (
    <div className="p-8 flex flex-col space-y-4 items-start">
      <h1 className="text-xl font-bold">Plaid Link Playground</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LinkButton
          token={token}
          action={setPublicToken}
          disabled={!!publicToken}
        />
        <div className="flex sm:flex-row flex-col">
          <span className="font-bold mr-2">Public Token:</span>
          <span className="text-gray-500">
            {publicToken ?? "Run Plaid Link First"}
          </span>
        </div>
        {publicToken && (
          <>
            <ExchangeButton
              token={publicToken}
              action={setAccessToken}
              disabled={!!accessToken}
            />
            <div className="flex sm:flex-row flex-col items-center space-x-2">
              <div className="font-bold mr-2">Access Token:</div>
              <div className="text-gray-500">
                {accessToken ?? "Exchange Public Token First"}
              </div>
            </div>
            {accessToken && (
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                disabled={!accessToken}
                onClick={copyAccessToken}
              >
                Copy Access Token
              </button>
            )}
          </>
        )}
      </Suspense>
    </div>
  );
}
