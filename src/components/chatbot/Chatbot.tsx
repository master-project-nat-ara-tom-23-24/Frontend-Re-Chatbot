import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useChatbot } from '../Hooks';
import { set } from 'lodash';
import ChatMessage from './ChatMessage';

export const Chatbot = () => {
    const [inputText, setInputText] = useState<string>('');
    const [messageArray, setMessageArray] = useState<Array<MessageI | undefined>>([]);
    const { submit, timer } = useChatbot('123');
    const { } = useParams();

    const processResponse = (response: MessageI | undefined) => {
        setMessageArray(prevMessages => {
            // Remove previous undefined message if there is one
            const filteredMessages = prevMessages.filter(message => message !== undefined);
            return [...filteredMessages, response];
        });
        setInputText(''); // Resetting input
    };

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            processResponse({ type: 'user', message: inputText, timestamp: new Date() });
            processResponse(undefined); // Add a placeholder for the bot's response
            var answer = await submit({ chatId: '123', prompt: inputText })
            processResponse({ type: 'access', message: answer.answer, timestamp: new Date(answer.timestamp) });
        }
    };

    return (
        <Box id="chat-container" fontFamily="Arial, sans-serif">
            <Box id="message-area" color="blackAlpha.700" padding="10px">
                {messageArray.map((message, index) => {
                    let showDate = false;
                    const currentTimestamp = message?.timestamp ? new Date(message.timestamp) : null;
                    const previousTimestamp = messageArray[index - 1]?.timestamp ? new Date(messageArray[index - 1]!.timestamp) : null;

                    // Function to check if the date is today
                    const isToday = (someDate: Date) => {
                        const today = new Date();
                        return someDate.getDate() === today.getDate() &&
                            someDate.getMonth() === today.getMonth() &&
                            someDate.getFullYear() === today.getFullYear();
                    };

                    // Function to check if the date is yesterday
                    const isYesterday = (someDate: Date) => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        return someDate.getDate() === yesterday.getDate() &&
                            someDate.getMonth() === yesterday.getMonth() &&
                            someDate.getFullYear() === yesterday.getFullYear();
                    };

                    if (index === 0 || (currentTimestamp && previousTimestamp && !isToday(currentTimestamp) && !isYesterday(currentTimestamp))) {
                        showDate = true;
                    }

                    return (
                        <Box key={index}>
                            {/* date */}
                            {showDate && currentTimestamp && (
                                <Box textAlign="center" marginBottom="10px">
                                    <Text>
                                        {isToday(currentTimestamp) && "Today"}
                                        {isYesterday(currentTimestamp) && "Yesterday"}
                                        {!isToday(currentTimestamp) && !isYesterday(currentTimestamp) && `${currentTimestamp!.getDate()}/${currentTimestamp!.getMonth() + 1}/${currentTimestamp!.getFullYear()}`}
                                    </Text>
                                </Box>
                            )}
                            {/* message */}
                            <ChatMessage key={index} message={message} index={index} />
                        </Box>
                    );
                })}
            </Box>
            <Box id="input-area" display="flex" alignItems="center" bottom="0" width="100%" padding="10px" boxShadow="md" bg="white" borderRadius="lg">
                <Text color="purple.500" fontSize="xl" marginRight="10px">{">"}</Text>
                <input
                    type="text"
                    placeholder="Type something and press Enter"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    style={{ color: "blackAlpha.700", width: 'calc(100% - 30px)', border: "none", outline: "none", fontSize: "md", fontFamily: "inherit", lineHeight: "normal" }}
                />
            </Box>
        </Box>
    );

}
