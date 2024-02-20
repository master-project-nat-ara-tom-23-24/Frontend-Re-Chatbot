import { Box, Text, Spinner } from '@chakra-ui/react';

const ChatMessage = ({ message, index }: { message: MessageI | undefined; index: number }) => {
    const isUser = message?.type === 'user';

    return (
        <Box
            key={index}
            py="10px"
            //textAlign={isUser ? 'right' : 'left'}
            display="flex"
            justifyContent={isUser ? 'flex-end' : 'flex-start'}
        >
            {message === undefined ? (
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={isUser ? 'blackAlpha.700' : 'purple.500'}
                    size="md"
                    mr="2"
                />
            ) : (
                <Box
                    borderRadius="md"
                    bg={isUser ? 'blackAlpha.100' : 'purple.100'}
                    borderWidth="1px"
                    p="8px"
                    maxWidth="75%"
                    width="auto"
                    display="flex"
                    flexDirection="column"
                    boxShadow="md"
                >
                    {/* message */}
                    <Text color={isUser ? 'blackAlpha.700' : 'purple.600'} wordBreak="break-word">{message.message}</Text>
                    {/* timestamp */}
                    <Text alignSelf={isUser ? 'flex-end' : 'flex-start'} color="gray.500" fontSize="xs">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default ChatMessage;
