import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Textarea } from '@chakra-ui/react';
import { useChatbot } from '../Hooks';
import ChatMessage from './ChatMessage';
import { set, update } from 'lodash';

export const Chatbot = () => {
    const [inputText, setInputText] = useState<string>('');
    const [inputSize, setInputSize] = useState(0);
    const [messageArray, setMessageArray] = useState<Array<MessageI | undefined>>([]);
    const { query, submit } = useChatbot('123');
    const [textAreaHeight, setTextAreaHeight] = useState('auto');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const INPUT_LIMIT = 2000;

    useEffect(() => {
        // Fetch the chat history
        query.refetch().then(
            (response) => {
                let messages: MessageI[] = [];
                if (response.data !== undefined) {
                    for (let i = 0; i < response.data.length; i += 2) {
                        messages.push({ type: 'user', message: response.data[i].message, timestamp: new Date(), metadata: undefined });
                        messages.push({
                            type: 'access',
                            message: response.data[i + 1].message,
                            timestamp: new Date(response.data[i + 1].timestamp),
                            metadata: response.data[i + 1].metadata
                        });
                    }
                    setMessageArray(messages);
                }
            }
        );

        // Set the height of the textarea to auto
        if (textAreaRef.current) {
            setTextAreaHeight('auto');
            // Force reflow to get the correct scrollHeight
            void textAreaRef.current.offsetHeight;

            let h: number = 0;
            if (textAreaRef.current.scrollHeight > 100)
                h = 100; // Limit height
            else
                h = textAreaRef.current.scrollHeight;

            setTextAreaHeight(`${h}px`);
        }

        setInputSize(inputText.length);
    }, [inputText]);

    const processResponse = (response: MessageI | undefined) => {
        setMessageArray(prevMessages => {
            // Remove previous undefined message if there is one
            const filteredMessages = prevMessages.filter(message => message !== undefined);

            return [...filteredMessages, response];
        });
        setInputText(''); // Resetting input
    };

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // TODO: Add a new line
                return;
            }

            processResponse({ type: 'user', message: inputText, timestamp: new Date(), metadata: [] });
            processResponse(undefined); // Add a placeholder for the bot's response

            var answer = await submit({ prompt: inputText })
            // var answer = { llmOutput: `Hello, I am a chatbot.\n How can I help you?`, llmTimestamp: new Date(), metadata: [{ source: "Book 3", pages: "1,2" }] }
            
            processResponse({ type: 'access', message: answer.llmOutput ?? 'Something went wrong', timestamp: new Date(answer.llmTimestamp), metadata: answer.metadata });
        } else if (event.key === 'ArrowUp') {
            const lastUserMessage = messageArray[messageArray.length - 2]?.message ?? '';
            setInputText(lastUserMessage);

            // Set the cursor to the end of the input message
            const inputElement = event.target as HTMLInputElement;
            setTimeout(() => {
                inputElement.selectionStart = inputElement.selectionEnd = lastUserMessage.length;
            }, 0);
        }

        
    };

    const setNewInputText = (newInputText: string) => {
        setInputText(newInputText);
        setInputSize(newInputText.length);
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
            <Box id="input-area" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" bottom="0" width="100%" padding="5px 10px 0px 10px" boxShadow="md" bg="white" borderRadius="lg">
                <Box display="flex" alignItems="center" width="100%">
                    <Text color="purple.500" fontSize="xl" marginRight="10px">{">"}</Text>
                    <Textarea
                        ref={textAreaRef}
                        placeholder="Type something and press Enter"
                        value={inputText}
                        onChange={(e) => {
                            if (e.target.value.length <= INPUT_LIMIT) {
                                setNewInputText(e.target.value);
                            } else {
                                setNewInputText(e.target.value.slice(0, INPUT_LIMIT));
                                // set user selection to the end of the input and delete spaces
                                const inputElement = e.target as HTMLTextAreaElement;
                                inputElement.selectionStart = inputElement.selectionEnd = INPUT_LIMIT;
                            }
                            
                        }}
                        onKeyDown={handleKeyPress}
                        style={{ color: "blackAlpha.700", width: 'calc(100% - 30px)', border: "none", outline: "none", fontSize: "md", fontFamily: "inherit", lineHeight: "normal", resize: "none", overflow: "scroll", height: textAreaHeight, minHeight: "30px"}}
                    />
                </Box>
                <Text color="gray.500" fontSize="sm" lineHeight="shorter" alignSelf="end">{inputSize}/{INPUT_LIMIT}</Text>
            </Box>
        </Box>
    );

}
