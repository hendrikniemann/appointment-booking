const API_TOKEN = 'Moy2XGw-R368KDWhObFDTg.73de9W4yJr0f3QetQgDgl9qwTEsBtOmpbKaw';
const API_ENDPOINT = 'https://api.beta.leasy.dev/graphql';

function fetchQuery(
  query: string,
  variables: { [key: string]: any } = {},
  operationName: string | null = null
) {
  return fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables, operationName }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('GraphQL request failed, please try again.');
    })
    .then((json) => {
      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors[0].message);
      }
      return json.data;
    });
}

export type GetSlotsInIntervalQueryType = {
  readonly resource: null | {
    readonly id: string;
    readonly slots: {
      readonly edges: null | ReadonlyArray<{
        readonly node: null | {
          readonly startTime: string;
          readonly endTime: string;
          readonly available: boolean;
        };
      }>;
    };
  };
};

export function getSlotsInInterval(
  resourceId: string,
  interval: { start: Date | number; end: Date | number }
): Promise<GetSlotsInIntervalQueryType> {
  return fetchQuery(
    /* GraphQL */ `
      query GetSlotsInInterval($resourceId: ID!, $start: DateTime, $end: DateTime) {
        resource(id: $resourceId) {
          id
          slots(filter: { after: $start, before: $end, available: true }) {
            edges {
              node {
                startTime
                endTime
                available
              }
            }
          }
        }
      }
    `,
    { resourceId, ...interval }
  );
}

export type Reservation = {
  id: string;
  completedAt: string | null;
  expiresAt: string | null;
  bookings: [
    {
      id: string;
      startTime: string;
      endTime: string;
      resource?: { id: string; denomination?: string | null };
    }
  ];
};

export function createReservation(payload: {
  startTime: string;
  endTime: string;
}): Promise<Reservation> {
  return fetch('/.netlify/functions/reservation', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Creating reservation failed.');
    })
    .then((result) => {
      if (result.success) {
        return result.reservation;
      }
      throw new Error('Creating reservation failed.');
    });
}

export function completeReservation(payload: {
  reservationId: string;
  name: string;
  email: string;
}): Promise<Reservation> {
  return fetch('/.netlify/functions/reservation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Completing reservation failed.');
    })
    .then((result) => {
      if (result.success) {
        return result.reservation;
      }
      throw new Error('Creating reservation failed.');
    });
}

export function cancelReservation(payload: { reservationId: string }): Promise<void> {
  return fetch('/.netlify/functions/reservation', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Cancelling reservation failed.');
    })
    .then((result) => {
      if (!result.success) {
        throw new Error('Cancelling reservation failed.');
      }
    });
}
