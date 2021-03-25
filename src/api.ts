const API_TOKEN = "Moy2XGw-R368KDWhObFDTg.73de9W4yJr0f3QetQgDgl9qwTEsBtOmpbKaw";
const API_ENDPOINT = "https://api.beta.leasy.dev/graphql";

function fetchQuery(
  query: string,
  variables: { [key: string]: any } = {},
  operationName: string | null = null
) {
  return fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables, operationName }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("GraphQL request failed, please try again.");
    })
    .then((json) => {
      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors[0].message);
      }
      return json.data;
    });
}

export type GetSlotsInIntervalQueryType = {
  model: null | {
    id: string;
    slots: {
      edges: null | ReadonlyArray<{
        node: null | {
          startTime: string;
          endTime: string;
          available: boolean;
        };
      }>;
    };
  };
};

export function getSlotsInInterval(
  modelId: string,
  interval: { start: Date | number; end: Date | number }
): Promise<GetSlotsInIntervalQueryType> {
  return fetchQuery(
    /* GraphQL */ `
      query GetSlotsInInterval(
        $modelId: ID!
        $start: DateTime
        $end: DateTime
      ) {
        model(id: $modelId) {
          id
          slots(filter: { after: $start, before: $end }) {
            edges {
              node {
                startTime
                endTime
                availableAssetsCount
                available
              }
            }
          }
        }
      }
    `,
    { modelId, ...interval }
  );
}

export function createReservation(
  modelId: string,
  interval: { start: Date | number; end: Date | number }
): Promise<GetSlotsInIntervalQueryType> {
  return fetchQuery(
    /* GraphQL */ `
      query GetSlotsInInterval(
        $modelId: ID!
        $start: DateTime
        $end: DateTime
      ) {
        model(id: $modelId) {
          id
          slots(filter: { after: $start, before: $end }) {
            edges {
              node {
                startTime
                endTime
                availableAssetsCount
                available
              }
            }
          }
        }
      }
    `,
    { modelId, ...interval }
  );
}
