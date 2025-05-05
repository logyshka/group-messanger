import React, {useEffect, useRef, useState} from 'react';
import ChatList from './ChatList';
import MessageList from '../message/MessageList';
import MessageForm from '../message/MessageForm';
import EditMessageForm from '../message/EditMessageForm';
import DeleteConfirmModal from '../message/DeleteConfirmModal';
import {useAuth} from '../../contexts/AuthContext';

import {Container} from "@mui/material";
import {Grid} from "@mui/joy";
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from "@mui/joy/Button";


const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const {logout} = useAuth();
    const messageContainerRef = useRef(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLoggingOut = async () => {
        setLoggingOut(true);

        setTimeout(() => {
            logout();
            setLoggingOut(false);
        }, 2000);
    }

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setShow(false);
        setEditingMessage(null);
        setMessageToDelete(null);
    };

    const handleOnStartDeleting = (message) => {
        setMessageToDelete(message);
    }

    const handleMessageSentOrUpdated = () => {
        setEditingMessage(null);
        setRefreshTrigger(prev => prev + 1);
    };


    const handleConfirmDelete = () => {
        setMessageToDelete(null);
        setRefreshTrigger(prev => prev + 1);
    };


    return (
        <>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title><h2>Select chat</h2></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Grid display="flex" justifyContent='center'>
                        <ChatList
                            onSelectChat={handleSelectChat}
                            selectedChatId={selectedChat?.id}
                        />
                    </Grid>
                    <div className='position-sticky start-0 bottom-0 pt-3'>
                        {
                            loggingOut ? (
                                <Button color='danger' loading>Logout</Button>
                            ) : (
                                <Button color='danger' onClick={handleLoggingOut}>Logout</Button>
                            )
                        }
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <Container fluid='true' maxWidth='100%'>
                <Grid
                    minWidth='100%'
                    display="flex"
                    justifyContent="center"
                    paddingY='2vh'
                    gap='3vh'
                    sx={{borderBottom: 1}}
                    position="fixed"
                    zIndex={1}
                    bgcolor='white'
                    top={0}
                    left={0}
                    height='10vh'
                    flexShrink={0}
                >

                    <Grid size="auto">
                        {selectedChat ? (
                            <Grid
                                display='flex'
                                justifyContent='center'
                                alignItems='center'
                                gap='2vh'
                                onClick={handleShow}
                            >
                                <h2 onClick={handleShow} style={{cursor: "pointer"}}>
                                    {selectedChat.name} <small className="text-secondary">(Click to change)</small>
                                </h2>
                            </Grid>
                        ) : (<h2>Select chat</h2>)}
                    </Grid>
                </Grid>

                <div
                    ref={messageContainerRef}
                    style={{
                        marginTop: '10vh',        // высота хедера
                        marginBottom: '10vh',     // высота футера
                        overflowY: 'auto',
                        height: '80vh',
                        paddingTop: '2vh',
                        paddingBottom: '2vh'
                    }}
                >
                    {selectedChat ? (
                        <>

                            <MessageList
                                chatId={selectedChat.id}
                                onEditMessage={setEditingMessage}
                                onDeleteMessage={handleOnStartDeleting}
                                refreshTrigger={refreshTrigger}
                            />
                            <Grid position="fixed" zIndex={1} bottom={0} left={0} height='10vh' maxHeight='10vh'
                                  width='100%' bgcolor='#f2f2f2'>
                                {editingMessage ? (
                                    <EditMessageForm
                                        chatId={selectedChat.id}
                                        message={editingMessage}
                                        onMessageUpdated={handleMessageSentOrUpdated}
                                        onCancel={() => setEditingMessage(null)}
                                    />
                                ) : (
                                    <MessageForm
                                        chatId={selectedChat.id}
                                        onMessageSent={handleMessageSentOrUpdated}
                                    />
                                )}
                            </Grid>
                        </>
                    ) : (

                        <Grid display="flex" justifyContent='center'>
                            <ChatList
                                onSelectChat={handleSelectChat}
                                selectedChatId={selectedChat?.id}
                            />
                        </Grid>
                    )}
                </div>
            </Container>

            {(selectedChat && messageToDelete) && (
                <DeleteConfirmModal
                    message={messageToDelete}
                    chatId={selectedChat.id}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => {
                        setMessageToDelete(null);
                    }}
                    show={messageToDelete}
                />
            )}
        </>
    );
};

export default ChatPage;
