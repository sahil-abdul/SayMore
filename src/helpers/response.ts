export default async function response(
  message: string,
  success: boolean,
  status: number,
  data?: any
) {
  return Response.json(
    {
      message: message,
      success: success,
      data,
    },
    {
      status: status,
    }
  );
}
