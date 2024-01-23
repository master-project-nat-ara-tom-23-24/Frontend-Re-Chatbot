import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, ButtonGroup, Center,
    Code, Divider, Flex, HStack, Icon, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader,
    ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, SimpleGrid, Stack, Tab, TabList,
    TabPanel, TabPanels, Tabs, Tag, Text, useDisclosure, useToast, VStack
  } from '@chakra-ui/react'
import React, { useState } from 'react'

interface ChatbotProps {
    myStringProp: String,
}

const Chatbots: React.FC<ChatbotProps> = ({ myStringProp }) => {
    const [inputText, setInputText] = useState<string>('');
    const [displayText, setDisplayText] = useState<string | null>(null);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
        setDisplayText(myStringProp + ' : ' + inputText);
        // onTextSubmit(inputText);
        setInputText(''); // Reseting input
        }
    };

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

export default Chatbots;