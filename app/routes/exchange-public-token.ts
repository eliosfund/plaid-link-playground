import { LoaderFunction, json } from "@remix-run/node";
import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";

export const loader: LoaderFunction = async ({ request }) => {
  const { public_token } = await request.json();

  if (!public_token) {
    return json({ error: "Public token is required" }, { status: 400 });
  }

  const config = new Configuration({
    basePath:
      PlaidEnvironments[
        process.env.PLAID_ENV as keyof typeof PlaidEnvironments
      ],
    baseOptions: {
      headers: {
        Authorization: `Bearer ${process.env.PLAID_SECRET}`,
        Accept: "application/json",
      },
    },
  });

  const client = new PlaidApi(config);

  const response = await client.itemPublicTokenExchange({
    public_token,
  });

  return json({ accessToken: response.data.access_token });
};
