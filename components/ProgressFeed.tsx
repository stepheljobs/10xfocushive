
import {
    List,
    ListItem,
    ListIcon,
    Flex,
    Box,
    Text,
  } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

const ProgressFeed = () => {
    return <Flex flexDirection={'column'} color='white'>
      <Box p={8}>
        <Text color={'black'} fontWeight="bold">Whats happening today?</Text>
      </Box>
      <Box p={8} flex='1'>
        <List spacing={3}>
          <ListItem color={'black'}>
            <ListIcon as={CheckCircleIcon} color='green.500' />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </ListItem>
          <ListItem color={'black'}>
            <ListIcon as={CheckCircleIcon} color='green.500' />
            Assumenda, quia temporibus eveniet a libero incidunt suscipit
          </ListItem>
          <ListItem color={'black'}>
            <ListIcon as={CheckCircleIcon} color='green.500' />
            Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
          </ListItem>
          <ListItem color={'black'}>
            <ListIcon as={CheckCircleIcon} color='green.500' />
            Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
          </ListItem>
        </List>
      </Box>
    </Flex>
  }

  export default ProgressFeed;