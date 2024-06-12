import { PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";

export const LinkButton: React.FC<{
  token: string | null;
  action: any;
  disabled: boolean;
}> = ({ token, action, disabled }) => {
  const onSuccess: PlaidLinkOnSuccess = (public_token, metadata) => {
    action(public_token);
  };

  const config = { token, onSuccess };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <button
      onClick={() => open()}
      disabled={!ready || disabled}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Open Plaid Link
    </button>
  );
};
