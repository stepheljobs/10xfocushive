import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Flex, Heading  } from "@chakra-ui/react";

const Header = () => (
  <Flex justifyContent={'space-between'} p={4} shadow="md">
    <div>
      <Link href="/">
          <Heading >10xFocusHive</Heading >
      </Link>
    </div>
    <div>
      <SignedIn>
        <UserButton
          userProfileMode="navigation"
          userProfileUrl="/user"
          afterSignOutUrl="/"
          afterSignOutAll="/"
          afterSignOutOneUrl="/"
        />
      </SignedIn>
    </div>
  </Flex>
);

export default Header;