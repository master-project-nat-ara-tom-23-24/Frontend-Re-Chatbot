import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Icon, Divider, Tooltip } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query'
import { useStatus } from '../Hooks';
import { FiSend } from 'react-icons/fi'
import { get } from 'lodash';


export const FileUploadStatus = () => {
    const { data: courses } = useQuery<CourseOverview[]>(['courses'])
    const [statusArray, setStatusArray] = useState<Array<CourseFilesUploadStatusI | undefined>>([]);
    const { query : queryAllCourses } = useStatus(courses?.map(course => course.slug)??[]);
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        // fillStatusDummyData();~
        getAllStatus();
    }, []);

    const getAllStatus = () => {
        // for each course slug available
        if (!courses)
            throw new Error('Courses are not available to get status');

        queryAllCourses.refetch().then(
            (response) => {
                console.log(response);
                let courseStatusArray: Array<CourseFilesUploadStatusI> = [];
                for (const course of courses) {
                    const status : FilesUploadStatusI = { successful: [], failed: [], date: new Date() };
                    courseStatusArray.push({ courseSlug: course.information["en"].title, status: status });
                }
                setStatusArray(courseStatusArray);
            }
        );
    }

    const fillStatusDummyData = () => {
        let statusGreen: FilesUploadStatusI = {
            successful: ["This is a successful file"],
            failed: [],
            date: new Date()
        };
        let statusYellow: FilesUploadStatusI = {
            successful: ["This is a successful file", "This is another successful file"],
            failed: ["This is a failed file"],
            date: new Date()
        };
        let statusRed: FilesUploadStatusI = {
            successful: [],
            failed: ["This is a failed file", "This is another failed file"],
            date: new Date()
        };
        let courseStatusArray: Array<CourseFilesUploadStatusI> = [];

        if (courses && courses?.length === 0) {
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
            console.log(courses);
            if (!courses)  
                throw new Error('Courses are not available');

            for (var course of courses) {
                courseStatusArray.push({ courseSlug: course.information["en"].title, status: statusGreen });
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
        <Box overflow='auto'>
            <VStack justify='start' spacing={4} minH='xs' color='blackAlpha.800'>
                {statusArray.map((s, index) => {
                    if (s) {
                        let color = getColor(s.status.successful, s.status.failed)
                        return (
                        <Box key={index} border="2px solid" padding="8px 12px" bg={color + '.200'} borderColor={color + '.500'} borderRadius="8px" width='90%'>
                            <Text>{s.courseSlug}</Text>
                            <Tooltip
                                background='white'
                                borderRadius='lg'
                                label={
                                    <VStack align='start' padding='8px'>
                                        {s.status.successful.map((fileName, index) => {
                                            return (
                                                <Text key={index} color='green.500' fontSize="s">
                                                    {fileName}
                                                </Text>
                                            )
                                        })}
                                        {s.status.successful.length == 0 || s.status.failed.length == 0 ?
                                            <></> : <Divider borderColor='blackAlpha.600' />
                                        }
                                        {s.status.failed.map((fileName, index) => {
                                            return (
                                                <Text key={index} color='red.500' fontSize="s">
                                                    {fileName}
                                                </Text>
                                            )
                                        })}
                                    </VStack>
                                }
                            >
                                <Box>{`${s.status.successful.length} out of ${s.status.successful.length + s.status.failed.length} successful`}</Box>
                            </Tooltip>
                        </Box>
                        );
                    }
                    else return (<></>);
                    })
                }
            </VStack>
        </Box>
    );
}