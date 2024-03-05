import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useChatbot } from '../Hooks';
const { query, submit } = useChatbot('123');

const [statusArray, setStatusArray] = useState<Array<StatusI | undefined>>([]);

// !! TODO: this is broken but the point is to run a get request for each course every X seconds

// useEffect(() => {
//     query.refetch().then(
//         (response) => {
//             let status: StatusI = {
//                 debug: response.data.debug,
//                 successful: response.data.successful,
//                 failed: response.data.failed,
//                 date: new Date(response.data.date)
//             };
//             if (response.data !== undefined) {
//                 for (let i = 0; i < response.data.length; i += 2) {
//                     status.push({ debug: response.data[i].message });
//                 }
//                 setStatusArray(status);
//             }
//         }
//     );
// }, []);

const fillStatusDummyData = () => {
    // create 3 dummy status objects
    let status1: StatusI = {
        debug: "This is a debug message",
        successful: ["This is a successful message"],
        failed: ["This is a failed message"],
        date: new Date()
    };
    let status2: StatusI = {
        debug: "This is a debug message",
        successful: ["This is a successful message"],
        failed: ["This is a failed message"],
        date: new Date()
    };
    let status3: StatusI = {
        debug: "This is a debug message",
        successful: ["This is a successful message"],
        failed: ["This is a failed message"],
        date: new Date()
    };
};

interface BoxProps {
    // define your props here if any
}

const FileUploadStatus: React.FC<BoxProps> = (props) => {
    fillStatusDummyData();

    return (
        <Box>
            {statusArray.map((status, index) => {
                return (
                    <Text key={index}>{status?.debug}</Text>
                );
            })}
        </Box>
    );
}

export default FileUploadStatus;