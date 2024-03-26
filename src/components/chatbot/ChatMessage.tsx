import { Box, Text, Spinner, Flex, Tooltip } from '@chakra-ui/react';

const ChatMessage = ({ message, index }: { message: MessageI | undefined; index: number }) => {
    const isUser = message?.type === 'user';

    const processMetadata = (metadata: MetadataI[]): string => {
        let metadataString = '';

        metadata.forEach((meta, index) => {
            metadataString += `${meta.source} - Pages ${meta.pages}${index === metadata.length - 1 ? '' : ''}\n`;
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
                    <Text
                        color={isUser ? 'blackAlpha.700' : 'purple.600'} wordBreak="break-word" whiteSpace="pre-line">
                        {message.message}
                    </Text>
                    <Flex flexDirection={isUser ? 'row-reverse' : 'row'} justifyContent="space-between" alignItems="end">
                        {/* timestamp */}
                        <Text color="gray.500" fontSize="xs" height="fit-content">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        {/* metadata */}
                        {isUser ? null : message.metadata && message.metadata.length > 0 &&
                            <Tooltip
                                background={"gray.200"}
                                boxShadow={"0 6px 12px 0 rgba(0,0,0,0.3)"}
                                label={message.metadata?.map((meta, index) => {
                                    return (
                                        <Text key={index} color="gray.500" fontSize="s">
                                            {meta.source}{meta.pages != null ? ` - Page${!meta.pages.includes(',') ? '' : 's'}: ${meta.pages}` : ''}
                                        </Text>
                                    )
                                })}
                            >
                                <Box borderRadius="md" bg="blackAlpha.200" p="1px" cursor={"pointer"}>🔎</Box>
                            </Tooltip>
                        }
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

export default ChatMessage;
