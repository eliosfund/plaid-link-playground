import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";
import { Link } from "~/routes/components/link";
import { Exchange } from "~/routes/components/exchange";

interface LoaderData {
  token: string;
}

export const loader: LoaderFunction = async () => {
  const response = await fetch(process.env.URL + "/get-public-token");
  const data = await response.json();
  return json<LoaderData>(data);
};

export default function Index() {
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const { token } = useLoaderData<LoaderData>();

  return (
    <div className="p-8 flex flex-col space-y-4 items-start">
      <h1 className="text-xl font-bold">Plaid Link Playground</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Link token={token} action={setPublicToken} />
        <div className="flex flex-row">
          <span className="font-bold mr-2">Public Token:</span>{" "}
          <span className="text-gray-500">
            {publicToken ?? "Run Plaid Link First"}
          </span>
        </div>
        {publicToken && (
          <>
            <Exchange token={publicToken} />
            <div className="flex flex-row">
              <span className="font-bold mr-2">Access Token:</span>{" "}
              <span className="text-gray-500">
                {accessToken ?? "No Access Token"}
              </span>
            </div>
          </>
        )}
      </Suspense>
    </div>
  );
}
