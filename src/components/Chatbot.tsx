import { Box, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useChatbot } from './Hooks'

// interface ChatbotProps {
//     taskInfo: TaskInfoI,
// }

// export interface TaskInfoI {
//     courseSlug: String,
//     assignmentID: String,
//     taskID: String
// }

interface MessageI {
    prompt: string,
    answer: string
}

export const Chatbot = () => {
    const [inputText, setInputText] = useState<string>('');
    const { data: query, submit, timer } = useChatbot('123')
    // const chatbotAPI = axios.create({
    //     baseURL: `http://localhost:8081/${ctx.courseSlug}/assignments/${ctx.assignmentID}/tasks/${ctx.taskID}/chat/123/users/123/prompt`
    // }); ///{courseSlug}/assignments/{assignment}/tasks/{task}/chat/{chat}/users/{user}/prompt
    // chatbotAPI.defaults.headers.post['Content-Type'] = 'application/json';
    // chatbotAPI.defaults.headers.common = axios.defaults.headers.common;

    var MessagesArray : Array<MessageI> = [
        {prompt: "Hello", answer: "Hi there!"},
        {prompt: "How are you?", answer: "I'm good, thanks!"},
        {prompt: "What's your name?", answer: "My name is Chatbot."}
    ]

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // postRequest();
            var answer = await submit({ chatId: null, prompt: inputText })
            console.log('ANSWER ' + answer)
            // setDisplayText('My input: ' + inputText + '. To URL: ' + chatbotAPI.defaults.baseURL); // Debug pruposes
            setInputText(''); // Reseting input
        }
    };

    return (
        <div id="chat-container" style={{fontFamily: "Arial, sans-serif"}}>
            <div id="message-area" style={{color: "#fff", padding: "10px"}}>
                {!MessagesArray.length ?
                null
                :
                MessagesArray.map((message, index) => (
                    <div key={index} style={{marginBottom: "10px"}}>
                        <Box marginBottom="5px" borderRadius="md" backgroundColor="gray.200" borderColor="gray.300" borderWidth="1px" paddingLeft={"10px"}>
                            <Text color="#fff">{'User : ' + message.prompt}</Text>
                        </Box>
                        <Box marginBottom="15px" borderRadius="md" backgroundColor="gray.200" borderColor="gray.300" borderWidth="1px" paddingLeft={"10px"}>
                            <Text color="#ffa500">{'Bot ^^ : ' + message.answer}</Text>
                        </Box>
                    </div>
                ))}
            </div>
            <div id="input-area" style={{ bottom: "0", width: "100%", padding: "5px"}}>
                <span style={{color: "#ffa500", marginRight: "5px"}}>$</span>
                <input type="text"
                placeholder="Type something and press Enter"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{color: "#fff", width: 'calc(100% - 18px)' }}/>
            </div>
        </div>
    );
}