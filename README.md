# Meeting Booking App with Leasy, React and Chakra-UI

This open source project uses Leasy to create bookable time slots for your calendar.
It is meant to be deployed on Netlify, but it should be super easy to adopt it to any serverless environment.

## Development

### Getting started

1. Create a Leasy account and create:

   - A single category
   - A single model and select the created categoy
   - A single asset and select the created model
   - A schedule with slots that you want to
   - A read API key for the frontend
   - A write API key for the backend

1. Connect your schedule with the created model
1. Create a new project on Netlify and configure the following secrets

   - MODEL_ID and set your leasy model id
   - WRITE_API_KEY and set your write API key

1. Repace my picture with yours in `public` and set your social media links

### Development

Use the netlify CLI to run `yarn dev`.
This will connect your

### Analyse bundle size

```
yarn analyse
```

Then upload the file to [Bundle Buddy](https://bundle-buddy.com) ✨
