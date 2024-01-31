import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, ButtonGroup, Center,
    Code, Divider, Flex, HStack, Icon, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader,
    ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, SimpleGrid, Stack, Tab, TabList,
    TabPanel, TabPanels, Tabs, Tag, Text, useDisclosure, useToast, VStack
  } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'

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
    const ctx = taskInfo;
    const chatbotAPI = axios.create({
        baseURL: `http://localhost:8081/${ctx.courseSlug}/assignments/${ctx.assignmentID}/tasks/${ctx.taskID}/chat/123/prompt` // not valid
    }); ///{courseSlug}/assignments/{assignment}/tasks/{task}/chat/{chat}/users/{user}/prompt
    chatbotAPI.defaults.headers.post['Content-Type'] = 'application/json';
    chatbotAPI.defaults.headers.common = axios.defaults.headers.common;

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            postRequest();
            // setDisplayText('My input: ' + inputText + '. To URL: ' + chatbotAPI.defaults.baseURL); // Debug pruposes
            setInputText(''); // Reseting input
        }
    };

    const postRequest = () => {
        const inputData = {
            prompt: 'My input: ' + inputText
        };
        
        try {
            chatbotAPI.post('', inputData)
            .then((response) => {
                console.log(response.status, response.data.token)
            })
        } catch (error) {
            console.log(error)
        }
    }

    // const postRequest = (inputString: string) => {
    //   console.log('Some debug to make sure everything reaches the right places')
    //   // Simple POST request with a JSON body using fetch
    //   const requestOptions = {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ input_text: 'whatever you want' })
    //   };
    //   fetch('localhost:8001/query_llm', requestOptions)
    //       .then(response => response.json())
    //       .then(data => { 
    //         console.log('Last signs of life')
    //         setDisplayText(data.result)
    //       });
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