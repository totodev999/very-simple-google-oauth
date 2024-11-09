import { Box, Button, Center, Flex, Grid, Stack, Text } from '@mantine/core';

function App() {
  return (
    <Box h="100vh" display="grid" style={{ placeItems: 'center' }}>
      <Box>
        <Text fw="bold" ta="center">
          OAuth sample
        </Text>
        <form action="/api/auth/google" method="GET">
          <Button
            type="submit"
            color="gray.3"
            c="black"
            leftSection={
              <img
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                }}
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              />
            }
          >
            Google Login
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default App;
