import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query'
import { useStatus } from '../Hooks';
import { FiSend } from 'react-icons/fi'


export const FileUploadStatus = () => {
    const { data: courses } = useQuery<CourseOverview[]>(['courses'])
    const query = useStatus();
    const [statusArray, setStatusArray] = useState<Array<CourseFilesUploadStatusI | undefined>>([]);
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        fillStatusDummyData();
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
        let statusGreen: FilesUploadStatusI = {
            successful: ["This is a successful message"],
            failed: [],
            date: new Date()
        };
        let statusYellow: FilesUploadStatusI = {
            successful: ["This is a successful message"],
            failed: ["This is a failed message"],
            date: new Date()
        };
        let statusRed: FilesUploadStatusI = {
            successful: [],
            failed: ["This is a failed message"],
            date: new Date()
        };
        let courseStatusArray: Array<CourseFilesUploadStatusI> = [];

        if (courses?.length === 0) {
            // 3 course status
            const courseSlugs = ["dummy-course1", "dummy-course2", "dummy-course3"];
            const statusColors = [statusGreen, statusYellow, statusRed];
            courseSlugs.forEach((slug, index) => {
                let courseStatus: CourseFilesUploadStatusI = {
                    courseSlug: slug,
                    status: statusColors[index % statusColors.length]
                };
                courseStatusArray.push(courseStatus);
            });
        } else {
            for (var course in courses) {
                courseStatusArray.push({ courseSlug: course, status: statusGreen });
            }
        }
        setStatusArray(courseStatusArray);
    };

    const getColor = (success: string[], failed : string[]) : string => {
        let color : string;

        if (failed.length === 0) {
            color = 'green';
        } else if (failed.length != 0 && success.length != 0) {
            color = 'yellow';
        } else 
            color = 'red';

        return color;
    }

    // if (!courses || courses.length === 0)
    //     return <></>
    
    return (
        <VStack justify='center' spacing={4} minH='xs' color='blackAlpha.800'>
            <Icon as={FiSend} boxSize={16} opacity={0.3} />
            {statusArray.map((status, index) => {
                if (status) {
                    let color = getColor(status.status.successful, status.status.failed)
                    return (
                    <Box border="2px solid" padding="8px 12px" bg={color + '.200'} borderColor={color + '.500'} borderRadius="8px" width='90%'>
                        <Text>{status.courseSlug}</Text>
                        <Text>{status.status.successful}</Text>
                    </Box>
                    );
                }
                else return (<></>);
                })
            }
        </VStack>
        // <Box>
            // {statusArray.map((status, index) => {
            //     return (
            //         <Text>{status?.courseSlug}</Text>
            //         );
            //     })
            // }
        // </Box>
    );
}