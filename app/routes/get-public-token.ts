import { LoaderFunction, json } from "@remix-run/node";
import {
  PlaidApi,
  Configuration,
  PlaidEnvironments,
  Products,
  CountryCode,
} from "plaid";

export const loader: LoaderFunction = async () => {
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

  const response = await client.linkTokenCreate({
    user: {
      client_user_id: "unique-user-id",
    },
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    client_name: "Plaid Link Playground",
    products: [Products.Auth],
    country_codes: [CountryCode.Us],
    language: "en",
  });

  return json({ token: response.data.link_token });
};
