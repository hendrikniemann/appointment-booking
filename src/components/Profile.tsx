import { VStack, Avatar, Text, HStack, Link } from '@chakra-ui/react';
import * as React from 'react';
import { SiGithub, SiTwitter, SiLinkedin } from 'react-icons/si';
import { IoGlobeOutline } from 'react-icons/io5';

type SupportedSocials = 'website' | 'github' | 'twitter' | 'linkedin';

export type ProfileProps = {
  social: { [key in SupportedSocials]?: string };
};

export default function Profile(props: ProfileProps) {
  const icons: { [key in SupportedSocials]: React.ReactElement } = {
    website: <IoGlobeOutline stroke="#000000" />,
    github: <SiGithub fill="#000000" />,
    twitter: <SiTwitter fill="#1da1f2" />,
    linkedin: <SiLinkedin fill="#0077b5" />,
  };
  // @ts-expect-error weak type if Object.keys
  const socials = Object.keys(props.social).map((social: SupportedSocials) => {
    return (
      <Link key={social} variant="unstyled" aria-label={social} href={props.social[social]}>
        {icons[social]}
      </Link>
    );
  });
  return (
    <VStack py="4" px={['4', '4', '16']} spacing="2" flexShrink={1}>
      <Avatar size="xl" name="Hendrik Niemann" src="profile.jpeg" />
      <Text color="blackAlpha.700" textAlign="center" fontSize={['1rem', '1.25rem', '1.5rem']}>
        Hendrik Niemann
      </Text>
      <HStack spacing="2" fontSize={['1rem', '1.25rem', '1.5rem']}>
        {socials}
      </HStack>
    </VStack>
  );
}
