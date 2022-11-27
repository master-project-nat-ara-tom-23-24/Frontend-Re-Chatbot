import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, ButtonGroup, Center,
  CloseButton, Code, Divider, Flex, Grid, GridItem, Heading, HStack, Icon, IconButton, Image, Kbd, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverContent,
  PopoverTrigger, Spinner, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast, VStack
} from '@chakra-ui/react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { AnimatePresence, Reorder } from 'framer-motion'
import { Uri } from 'monaco-editor'
import React, { useEffect, useState } from 'react'
import { AiOutlineBulb, AiOutlineCode, AiOutlineReload, AiOutlineSend } from 'react-icons/ai'
import { BsCircleFill, BsUpload } from 'react-icons/bs'
import { FaFlask, FaTerminal } from 'react-icons/fa'
import { FiAlignJustify, FiFile } from 'react-icons/fi'
import { useOutletContext, useParams } from 'react-router-dom'
import { FileTab } from '../components/FileTab'
import { FileTree } from '../components/FileTree'
import { Screen, SplitHorizontal, SplitVertical } from '../components/Panels'
import TaskController from './TaskController'
import { HiDownload, HiUpload } from 'react-icons/hi'
import { ProgressBar } from '../components/Statistics'
import { MarkdownViewer } from '../components/MarkdownViewer'
import { unionBy } from 'lodash'
import JSZip from 'jszip'
import fileDownload from 'js-file-download'

const getUpdatedContent = (file: TaskFileProps, submission?: SubmissionProps) =>
    submission?.files.find(submitted => submitted.taskFileId === file.id)?.content || file.content || file.template
const updateFile = (file: TaskFileProps, submission?: SubmissionProps) =>
    ({ ...file, content: getUpdatedContent(file, submission) })

export default function Task() {
  const monaco = useMonaco()
  const toast = useToast()
  const confirm = useDisclosure()
  const upload = useDisclosure()
  const { taskURL } = useParams()
  const { isAssistant, user } = useOutletContext<UserContext>()
  const [userId, setUserId] = useState(user.email)
  const [currentSubmission, setCurrentSubmission] = useState<SubmissionProps>()
  const [currentFile, setCurrentFile] = useState<TaskFileProps>()
  const [openFiles, setOpenFiles] = useState<TaskFileProps[]>([])

  const { data: task, refetch: refreshTask } = useQuery<TaskProps>(['tasks', taskURL, 'users', userId])
  const { mutate: submit, isLoading } = useMutation<any, any, object>(['submit'],
      { onSettled: refreshTask, onSuccess: confirm.onClose })

  useEffect(() => {
    setCurrentFile(undefined)
  }, [taskURL])

  useEffect(() => {
    if (task && !currentFile) {
      const defaultFiles = task.files.filter(file => file.editable)
      setOpenFiles(defaultFiles)
      setCurrentFile(defaultFiles[0])
    }
  }, [currentFile, task])

  useEffect(() => {
    if (currentSubmission) {
      setOpenFiles(files => files.map(file => updateFile(file, currentSubmission)))
      setCurrentFile(file => file && updateFile(file, currentSubmission))
      toast({ title: 'Reloaded executed files', status: 'success', isClosable: true })
    }
  }, [currentSubmission, toast])

  useEffect(() => {
    if (currentFile)
      setOpenFiles(files => unionBy(files, [currentFile], 'id'))
  }, [currentFile])

  const getEditorContent = (fileId: number) => monaco?.editor.getModel(Uri.file(`/${fileId}`))?.getValue()
  const getContent = (file: TaskFileProps) => getEditorContent(file.id) || getUpdatedContent(file, currentSubmission)
  const onSubmit = (type: string) => () => submit({
    userId: user.email, restricted: !isAssistant, taskId: task?.id, currentFileId: currentFile?.id, type,
    files: task?.files.filter(file => file.editable).map(file => ({ taskFileId: file.id, content: getContent(file) }))
  })

  return (
      <AnimatePresence initial={false} mode='wait'>
        {task && currentFile &&
          <Screen key={task.id} flexGrow={1} w='full'>
            <Center px={4} pt={1} flexGrow={1} justifyContent='space-between'>
              <Box>
                <Heading fontSize='sm'>TASK {task.ordinalNum}</Heading>
                <Heading fontSize='lg' noOfLines={1}>{task.title}</Heading>
              </Box>
              <HStack>
                {((!isAssistant && task.active) || userId !== user?.email) &&
                  <HStack>
                    <Text fontSize='120%' fontWeight={600}>
                      {task.remainingAttempts}
                    </Text>
                    <Text noOfLines={1}>/ {task.maxAttempts} Submissions left</Text>
                    <Icon as={BsCircleFill} boxSize={1} color='gray.300' mx={4} />
                  </HStack>}
                <HStack>
                  <Text whiteSpace='nowrap'>Best Score:</Text>
                  <Text fontSize='120%' fontWeight={600}>{task.points}</Text>
                  <Text whiteSpace='nowrap'>{` / ${task.maxPoints}`}</Text>
                  <Center w={24}>
                    <ProgressBar value={task.points} max={task.maxPoints} />
                  </Center>
                </HStack>
              </HStack>
              <ButtonGroup variant='gradient'>
                <Button leftIcon={<FaFlask />} children='Test' isLoading={isLoading} onClick={onSubmit('test')} />
                <Button leftIcon={<FaTerminal />} children='Run' isLoading={isLoading} onClick={onSubmit('run')} />
                <Button colorScheme='green' leftIcon={<AiOutlineSend />} onClick={confirm.onOpen} children='Submit'
                        isDisabled={isLoading || (!isAssistant && (task.remainingAttempts <= 0 || !task.active))} />
                <Modal size='sm' isOpen={confirm.isOpen} onClose={confirm.onClose} isCentered closeOnOverlayClick>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>
                      <Text textAlign='center' color='purple.600'>Confirm Submission</Text>
                      <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                      <VStack p={3} minH={12} justify='space-between'>
                        <Text textAlign='center'>
                          Are you sure you want to submit?
                        </Text>
                        <ButtonGroup variant='round'>
                          <Button variant='border' isLoading={isLoading} onClick={confirm.onClose}>Cancel</Button>
                          <Button isLoading={isLoading} onClick={onSubmit('grade')}>Confirm</Button>
                        </ButtonGroup>
                      </VStack>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </ButtonGroup>
              {isAssistant &&
                <TaskController task={task} value={userId} defaultValue={user.email} onChange={setUserId} />}
            </Center>
            <Grid templateRows='85vh' templateColumns='85vw auto' boxShadow='xs' bg='base'>
              <GridItem as={Flex} boxSize='full'>
                <SplitVertical>
                  <Accordion allowMultiple defaultIndex={[0, 1]}>
                    <AccordionItem>
                      <AccordionButton gap={2} borderBottomWidth={1}>
                        <AccordionIcon />
                        <FiAlignJustify />
                        <Text fontWeight={500}>Instructions</Text>
                      </AccordionButton>
                      <AccordionPanel maxH='60vh' overflow='auto'>
                        <MarkdownViewer children={task.instructions} data={task.files} />
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem pos='relative' borderBottomColor='transparent'>
                      <AccordionButton gap={2} borderBottomWidth={1}>
                        <AccordionIcon />
                        <FiFile />
                        <Text fontWeight={500}>Files</Text>
                      </AccordionButton>
                      <ButtonGroup variant='ghost' size='sm' colorScheme='blackAlpha' pos='absolute' right={3} top={1}>
                        <IconButton icon={<Icon as={HiUpload} boxSize={5} />} aria-label='upload'
                                    onClick={upload.onOpen} />
                        <IconButton icon={<Icon as={HiDownload} boxSize={5} />} aria-label='download' onClick={() => {
                          let zip = new JSZip()
                          task.files.forEach(file => zip.file(file.path, getContent(file)))
                          zip.generateAsync({ type: 'blob' }).then(b => fileDownload(b, task.url + '.zip'))
                        }} />
                        <Modal isOpen={upload.isOpen} onClose={upload.onClose} isCentered closeOnOverlayClick>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              <Text textAlign='center' color='purple.600'>Upload Your Solution Files</Text>
                              <ModalCloseButton />
                            </ModalHeader>
                            <ModalBody>
                              <VStack p={3} justify='space-between'>
                                <Table>
                                  <Thead>
                                    <Tr>
                                      <Th>Task File</Th>
                                      <Th>Your Solution</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {task.files.filter(file => file.editable).map(file =>
                                        <Tr key={file.id}>
                                          <Td>{file.name}</Td>
                                          <Td>
                                            <Button leftIcon={<BsUpload />}>
                                              Select
                                            </Button>
                                          </Td>
                                        </Tr>)}
                                  </Tbody>
                                </Table>
                                <ButtonGroup variant='round' p={3}>
                                  <Button variant='border' isLoading={isLoading}
                                          onClick={upload.onClose}>Cancel</Button>
                                  <Button isLoading={isLoading}>Confirm</Button>
                                </ButtonGroup>
                              </VStack>
                            </ModalBody>
                          </ModalContent>
                        </Modal>
                      </ButtonGroup>
                      <AccordionPanel p={0} h='16vh' overflow='auto'>
                        <FileTree data={task.files} value={currentFile.id}
                                  onClick={file => setCurrentFile(updateFile(file, currentSubmission))} />
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </SplitVertical>
                <Stack spacing={0} boxSize='full' overflow='auto' position='relative'>
                  <Flex borderBottomWidth={1} borderColor='gray.200' p={1} pb={0} bg='blackAlpha.50'>
                    <Reorder.Group as='ul' axis='x' onReorder={setOpenFiles} values={openFiles}
                                   style={{ display: 'flex' }}>
                      <AnimatePresence initial={false}>
                        {openFiles.map(file =>
                            <FileTab key={file.id} value={file} isSelected={file.id === currentFile.id}>
                              <Text ml={3} my={2} fontFamily='Inter, Roboto, sans-serif' whiteSpace='nowrap'
                                    onClick={() => setCurrentFile(file)} cursor='pointer' children={file.name} />
                              <CloseButton size='sm' mx={2} isDisabled={file.id === currentFile.id}
                                           onClick={() => setOpenFiles(files =>
                                               files?.filter(openFile => openFile.id !== file.id))} />
                            </FileTab>)}
                      </AnimatePresence>
                    </Reorder.Group>
                  </Flex>
                  <SplitHorizontal>
                    <Editor loading={<Spinner />} path={`${currentFile.id}`} language={currentFile.language}
                            value={currentFile.content || currentFile.template}
                            options={{ minimap: { enabled: false }, readOnly: !currentFile.editable }} />
                    {currentFile.image &&
                      <Center p={2} position='absolute' bottom={0} bg='white' boxSize='full' zIndex={2}>
                        <Image src={`data:image/png;base64,${currentFile.bytes}`} h='auto' />
                      </Center>}
                  </SplitHorizontal>
                  <Stack boxSize='full' flexDir='column-reverse' overflowY='scroll' overflowX='auto'
                         p={2} bg='blackAlpha.800'>
                    {task.submissions.map(submission =>
                        <Box pb={2} key={submission.id}>
                          <HStack align='start'>
                            <Code color='orange.300'>{'>'}</Code>
                            <Code whiteSpace='pre-wrap'>{submission.name}</Code>
                          </HStack>
                          <HStack align='start'>
                            <Code color='orange.300'>$</Code>
                            <Code whiteSpace='pre-wrap' opacity={submission.output ? 1 : 0.8}>
                              {submission.output || 'No output'}
                            </Code>
                          </HStack>
                        </Box>)}
                  </Stack>
                </Stack>
              </GridItem>
              <GridItem as={Stack} bg='blackAlpha.100' borderLeftWidth={2} borderColor='blackAlpha.100' p={2}
                        overflow='auto'>
                <Heading fontSize='md' m={3}>Activity</Heading>
                {task.submissions.map(submission =>
                    <Flex key={submission.id} gap={2} fontSize='sm'>
                      <VStack>
                        <Icon as={BsCircleFill} mx={2} mt={1} boxSize={2} color='purple.500' />
                        <Divider orientation='vertical' borderColor='gray.500' />
                      </VStack>
                      <Stack mb={8}>
                        <HStack align='baseline' lineHeight={1.2}>
                          <Text fontWeight={500}>{submission.graded ? submission.name : 'Executed'}</Text>
                          {!submission.graded && <Kbd m={0} px={1} rounded='sm' fontSize='95%'
                                                      textTransform='capitalize'>{submission.type}</Kbd>}
                          {!submission.valid && <Badge colorScheme='red'>Not valid</Badge>}
                        </HStack>
                        <Text whiteSpace='nowrap' w='fit-content' pl={1} fontSize='0.7rem'>
                          {format(parseISO(submission.createdAt), 'dd.MM.yyyy HH:mm')}
                        </Text>
                        {submission.graded &&
                          <Box>
                            <HStack spacing={1}>
                              <Text fontWeight={600} fontSize='xl'>{submission.points}</Text>
                              <Text fontSize='lg' lineHeight={1}>/ {submission.maxPoints} Points</Text>
                            </HStack>
                            <ProgressBar value={submission.points} max={submission.maxPoints} />
                          </Box>}
                        <ButtonGroup size='xs' colorScheme='gray'>
                          <Popover placement='left'>
                            <PopoverTrigger>
                              <Button isDisabled={!submission.output} children={submission.graded ? 'Hint' : 'Output'}
                                      leftIcon={submission.graded ? <AiOutlineBulb /> : <AiOutlineCode />} />
                            </PopoverTrigger>
                            <PopoverContent w='fit-content' bg='yellow.50'>
                              <PopoverArrow />
                              <PopoverBody overflow='auto' fontSize='sm' whiteSpace='pre-wrap' maxH='2xs'>
                                {submission.output}
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                          <Button leftIcon={<AiOutlineReload />}
                                  onClick={() => setCurrentSubmission(submission)}>
                            Reload
                          </Button>
                        </ButtonGroup>
                      </Stack>
                    </Flex>)}
                <Flex gap={2} fontSize='sm'>
                  <VStack>
                    <Icon as={BsCircleFill} mx={2} mt={1} boxSize={2} color='purple.500' />
                    <Divider orientation='vertical' borderColor='gray.500' />
                  </VStack>
                  <Stack mb={8}>
                    <Text lineHeight={1.2} fontWeight={500}>Started task.</Text>
                  </Stack>
                </Flex>
              </GridItem>
            </Grid>
          </Screen>}
      </AnimatePresence>
  )
}