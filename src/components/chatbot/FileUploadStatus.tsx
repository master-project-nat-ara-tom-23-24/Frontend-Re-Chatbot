import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query'
import { useStatus } from '../Hooks';


export const FileUploadStatus = () => {
    const { data: courses } = useQuery<CourseOverview[]>(['courses'])
    const query = useStatus();
    const [statusArray, setStatusArray] = useState<Array<FilesUploadStatusI | undefined>>([]);
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        // todo
    }, []);

    const getStatus = () => {
        // for each course slug available
        if (!courses)
            return

        for (let i = 0; i < courses.length; i++) {
            
        }
    }

    const fillStatusDummyData = () => {
        // create 3 dummy status objects
        let status1: FilesUploadStatusI = {
            successful: ["This is a successful message"],
            failed: ["This is a failed message"],
            date: new Date()
        };
        let status2: FilesUploadStatusI = {
            successful: ["This is a successful message"],
            failed: ["This is a failed message"],
            date: new Date()
        };
        let status3: FilesUploadStatusI = {
            successful: ["This is a successful message"],
            failed: ["This is a failed message"],
            date: new Date()
        };
    };

    interface BoxProps {
        // define your props here if any
    }

    if (!courses)
        return <></>
    
    return (
        <Box>
            {statusArray.map((status, index) => {
                return (
                    <Text key={index}>{status?.date.toString()}</Text>
                    );
                })
            }
        </Box>
    );
}