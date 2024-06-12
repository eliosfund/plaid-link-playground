import { LoaderFunction, json, ActionFunctionArgs } from "@remix-run/node";
import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";

interface BodyData {
  public_token: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const public_token = body.get("public_token");

  if (!public_token) {
    return json(
      {
        error: "Public token is required",
      },
      {
        status: 400,
      },
    );
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

  try {
    const response = await client.itemPublicTokenExchange({
      public_token,
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
    });

    return json({ accessToken: response.data.access_token });
  } catch (error) {
    console.error("Error exchanging public token:", error);

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
}
