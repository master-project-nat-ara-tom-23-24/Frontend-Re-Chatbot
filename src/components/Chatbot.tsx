import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, ButtonGroup, Center,
    Code, Divider, Flex, HStack, Icon, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader,
    ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, SimpleGrid, Stack, Tab, TabList,
    TabPanel, TabPanels, Tabs, Tag, Text, useDisclosure, useToast, VStack
  } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useChatbot } from './Hooks'

interface ChatbotProps {
    taskInfo: TaskInfoI,
}

export interface TaskInfoI {
    courseSlug: String,
    assignmentID: String,
    taskID: String
}

export const Chatbot: React.FC<ChatbotProps> = ({ taskInfo }) => {
    const [inputText, setInputText] = useState<string>('');
    const [displayText, setDisplayText] = useState<string | null>(null);
    const { data: query, submit, timer } = useChatbot('123')
    const ctx = taskInfo;
    // const chatbotAPI = axios.create({
    //     baseURL: `http://localhost:8081/${ctx.courseSlug}/assignments/${ctx.assignmentID}/tasks/${ctx.taskID}/chat/123/users/123/prompt`
    // }); ///{courseSlug}/assignments/{assignment}/tasks/{task}/chat/{chat}/users/{user}/prompt
    // chatbotAPI.defaults.headers.post['Content-Type'] = 'application/json';
    // chatbotAPI.defaults.headers.common = axios.defaults.headers.common;

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // postRequest();
            var answer = await submit({ chatId: null, prompt: inputText })
            console.log('ANSWER ' + answer)
            // setDisplayText('My input: ' + inputText + '. To URL: ' + chatbotAPI.defaults.baseURL); // Debug pruposes
            setInputText(''); // Reseting input
        }
    };

    // const postRequest = () => {
    //     const inputData = {
    //         prompt: 'My input: ' + inputText
    //     };
        
    //     try {
    //         chatbotAPI.post('', inputData)
    //         .then((response) => {
    //             console.log(response.status, response.data.token)
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    return (
        <div>
        {displayText ? (
            <p>{displayText}</p>
        ) : (
            <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type something and press Enter"
            style={{ width: '100%' }} // Set width to 100%
            />
        )}
        </div>
    );
}