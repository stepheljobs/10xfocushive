import { Avatar, AvatarGroup, Box, Flex, Heading } from "@chakra-ui/react";

const WhoIsOnline = () => {
  return (
    <Flex flexDirection={"column"} color="white">
      <Box p={4}>
        <Heading color={"black"} fontWeight="bold">
          Who is coworking right now?
        </Heading>
      </Box>
      <Box p={4} flex="1">
        <AvatarGroup size="md" max={2}>
          <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
          <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
          <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
          <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
        </AvatarGroup>
      </Box>
    </Flex>
  );
};

export default WhoIsOnline;
