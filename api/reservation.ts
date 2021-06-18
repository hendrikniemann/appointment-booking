import { Handler } from '@netlify/functions';
import { Client, UserError } from 'leasy';
import yup from 'yup';
import mailjet from 'node-mailjet';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LEASY_WRITE_KEY: string;
      RESOURCE_ID: string;
      MAILJET_API_KEY?: string;
      OWN_EMAIL: string;
      NODE_ENV: 'development' | 'production';
      PWD: string;
    }
  }
}

const leasy = new Client({
  apiKey: process.env.LEASY_WRITE_KEY,
  // apiKey: 'L-o4W3WPTouuzV0Tz-sqOg.k4QpWEBSACqgjAyJhZ2ShlRpVYeM-tGntQ-R',
  // endpoint: 'http://localhost:8080/graphql',
});

const createReservationSchema = yup.object().shape({
  startTime: yup.date().required(),
  endTime: yup.date().required(),
});

const completeReservationSchema = yup.object().shape({
  name: yup.string().required().min(3).max(50),
  email: yup.string().required().email(),
  reservationId: yup.string().required().uuid(),
});

const cancelReservationSchema = yup.object().shape({
  reservationId: yup.string().required().uuid(),
});

/** Small helper function to quickly return responses */
function response(statusCode: number, body: any) {
  return { statusCode, body: JSON.stringify(body) };
}

export const handler: Handler = async function (event) {
  try {
    // Only accept JSON encoded bodies
    if (event.headers['content-type'] !== 'application/json') {
      return response(400, { success: false, message: 'wrong content type' });
    }
    if (!event.body) {
      return response(400, { success: false, message: 'body required' });
    }
    const body = JSON.parse(event.body);
    if (event.httpMethod === 'PUT') {
      await createReservationSchema.validate(body);
      const reservation = await leasy.reservations.create({
        bookings: [
          {
            bookableId: process.env.RESOURCE_ID,
            start: body.startTime,
            end: body.endTime,
          },
        ],
      });
      return response(200, { success: true, reservation });
    } else if (event.httpMethod === 'POST') {
      await completeReservationSchema.validate(body);
      const reservation = await leasy.reservations.update(body.reservationId, { complete: {} });

      if (process.env.MAILJET_API_KEY) {
        console.log('sending meail!');
        const result = await mailjet
          .connect('9bf02d963f17150c380edfc5bebeed9d', process.env.MAILJET_API_KEY)
          .post('send', { version: 'v3.1' })
          .request({
            Messages: [
              {
                From: { Email: process.env.OWN_EMAIL, Name: 'Hendrik Niemann' },
                To: [{ Email: process.env.OWN_EMAIL, Name: 'Hendrik Niemann' }],
                Subject: 'New appointment booking from ' + body.name,
                TextPart: `There is a new appointment booking:

Name: ${body.name}
Email: ${body.email}
Start: ${reservation.bookings[0].startTime}
End: ${reservation.bookings[0].endTime}
`,
                CustomID: `reservation-${reservation.id}`,
              },
            ],
          });
        console.log(result);
      }

      return response(200, { success: true, reservation });
    } else if (event.httpMethod === 'DELETE') {
      await cancelReservationSchema.validate(body);
      await leasy.reservations.delete(body.reservationId);
      return response(200, { success: true });
    } else {
      return response(404, { success: false, message: 'Not found' });
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return response(400, { success: false.valueOf, message: 'invalid JSON' });
    }
    if (error instanceof yup.ValidationError) {
      return response(400, { success: false, message: error.message });
    }
    if (error instanceof UserError) {
      return response(400, { success: false, message: error.message });
    }
    console.error(error);
    return response(500, {
      success: false,
      message: 'Internal Server Error',
    });
  }
};
