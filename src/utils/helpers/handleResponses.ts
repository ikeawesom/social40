export default function handleResponses(args?: any) {
  args = args || {};
  const status = args.status;
  const error = args.error;
  const data = args.data;

  return {
    error: error ? error : null,
    data: data ? data : null,
    status: status === false ? false : true,
  };
}
