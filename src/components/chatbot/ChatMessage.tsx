import { Box, Text, Spinner, Flex, Tooltip } from '@chakra-ui/react';

const ChatMessage = ({ message, index }: { message: MessageI | undefined; index: number }) => {
    const isUser = message?.type === 'user';

    const processMetadata = (metadata: MetadataI[]): string => {
        let metadataString = '';

        metadata.forEach((meta, index) => {
            metadataString += `${meta.source} - Pages ${meta.pages.join(', ')}${index === metadata.length - 1 ? '' : ''}\n`;
        });

        return metadataString;
    };
    
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
                    p="8px"
                    maxWidth="75%"
                    width="auto"
                    display="flex"
                    flexDirection="column"
                    boxShadow="md"
                >
                    {/* message */}
                    <Text color={isUser ? 'blackAlpha.700' : 'purple.600'} wordBreak="break-word">{message.message}</Text>
                    <Flex flexDirection="row" justifyContent="space-between">
                        {/* timestamp */}
                        <Text alignSelf={isUser ? 'flex-end' : 'flex-start'} color="gray.500" fontSize="xs">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        {/* metadata */}
                        {isUser ? null : 
                            <Tooltip 
                                background={"gray.200"}
                                boxShadow={"0 6px 12px 0 rgba(0,0,0,0.3)"}
                                label={ message.metadata.map((meta, index) => {
                                    return (
                                        <Text key={index} color="gray.500" fontSize="s">
                                            {meta.source} - Pages {meta.pages.join(", ")}
                                        </Text>
                                    )})}
                            >
                                <Box
                                    borderRadius="md"
                                    bg="blackAlpha.200"
                                    p="1px"
                                    cursor={"pointer"}
                                >
                                    🔎
                                </Box>
                            </Tooltip>
                        }
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

export default ChatMessage;
