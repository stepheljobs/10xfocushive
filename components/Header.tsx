import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Flex, Heading  } from "@chakra-ui/react";

const Header = () => (
  <Flex justifyContent={'space-between'} p={4}>
    <div>
      <Link href="/">
          <Heading as='h3' size='lg'>10xFocusHive</Heading >
      </Link>
    </div>
    <div>
      <SignedIn>
        <UserButton
          userProfileMode="navigation"
          userProfileUrl="/user"
          afterSignOutUrl="/"
        />
      </SignedIn>
    </div>
  </Flex>
);

export default Header;