/**
 *
 * @param {import("aws-lambda").APIGatewayEvent} event
 * @param {import("aws-lambda").Context} context
 */
exports.handler = async function (event, context) {
  if (
    event.httpMethod === "POST" &&
    event.headers["Content-Type"] === "application/json"
  ) {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }
  return {
    statusCode: 400,
    body: JSON.stringify({
      success: false,
      message: "This function only accepts POST requests with JSON content.",
    }),
  };
};
