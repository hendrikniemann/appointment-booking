import { Box, Stack } from '@chakra-ui/react';
import React from 'react';
import BookingController from './BookingController';
import Profile from './Profile';

export default function BookingCard() {
  return (
    <Stack
      direction={['column', 'row']}
      w={['100%', 'auto']}
      h={['100vh', 'auto']}
      spacing="4"
      rounded={['none', 'lg']}
      p={['2', '4', '6']}
      alignItems="center"
      bg="white"
      shadow="lg"
      justifyContent="center"
    >
      <Profile
        social={{
          website: 'https://hendrikniemann.dev',
          github: 'https://github.com/hendrikniemann',
          twitter: 'https://twitter.com/hendrik_niemann',
          linkedin: 'https://linkedin.com/hendrikniemann',
        }}
      />
      <Box maxWidth={[null, '290px']} height="350px">
        <BookingController resourceId="49a490c4-b67d-4e60-b1e7-c30215347d75" />
      </Box>
    </Stack>
  );
}
