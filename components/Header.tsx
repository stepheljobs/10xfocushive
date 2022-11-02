import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button, Flex, Heading } from "@chakra-ui/react";

const Header = () => (
  <Flex shadow={"md"} justifyContent={"space-between"} p={4}>
    <div>
      <Link href="/">
        <Heading as="h3" size="lg">
          10xFocusHive
        </Heading>
      </Link>
    </div>
    <Flex alignContent={"center"}>
      <Link target={'_blank'} href={'https://safemintlabs.convas.io/1'}>
        <Button mr={8} color="teal.500">Send us feedback</Button>
      </Link>
      <SignedIn>
        <UserButton
          userProfileMode="navigation"
          userProfileUrl="/user"
          afterSignOutUrl="/"
        />
      </SignedIn>
    </Flex>
  </Flex>
);

export default Header;
