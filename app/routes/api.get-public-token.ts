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

  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: "1",
      },
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      client_name: "Plaid Link Playground",
      products: [Products.Auth],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return json({ token: response.data.link_token });
  } catch (error) {
    console.error("Error creating link token:", error);

    return json(
      {
        error: error.response.data.error_code,
        message: error.response.data.error_message,
      },
      {
        status: error.status,
      },
    );
  }
};
