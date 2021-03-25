import { Stack } from "@chakra-ui/react";
import React from "react";
import Calendar from "./Calendar";
import Profile from "./Profile";

export default function BookingCard() {
  return (
    <Stack
      direction={["column", "row"]}
      w={["100%", "auto"]}
      h={["100vh", "auto"]}
      spacing="4"
      rounded={["none", "lg"]}
      p={["2", "4", "6"]}
      alignItems="center"
      bg="white"
      shadow="lg"
      justifyContent="center"
    >
      <Profile
        social={{
          website: "https://hendrikniemann.dev",
          github: "https://github.com/hendrikniemann",
          twitter: "https://twitter.com/hendrik_niemann",
          linkedin: "https://linkedin.com/hendrikniemann",
        }}
      />
      <Calendar modelId="aff58c1a-f1ba-49b4-9e23-dd652b8c194f" />
    </Stack>
  );
}
