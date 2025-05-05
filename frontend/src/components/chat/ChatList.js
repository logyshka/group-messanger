import React, {useEffect, useState} from 'react';
import {chatsAPI} from '../../services/api';
import './ChatList.css';
import Form from 'react-bootstrap/Form';

import {CircularProgress, Stack} from "@mui/material";
import {Grid} from "@mui/joy";
import Button from "@mui/joy/Button";
import {ListGroup} from "react-bootstrap";


const ChatList = ({onSelectChat, selectedChatId}) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newChatName, setNewChatName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        setLoading(true);
        try {
            const data = await chatsAPI.getChats();
            setChats(data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChat = async (e) => {
        e.preventDefault();
        if (!newChatName.trim()) return;

        setIsCreating(true);
        try {
            const newChat = await chatsAPI.createChat(newChatName);
            setChats([...chats, newChat]);
            setNewChatName('');
        } catch (error) {
            console.error('Error creating chat:', error);
        } finally {
            setIsCreating(false);
        }
    };


    return (
        <>
            {loading ? (<CircularProgress/>) : (
                <div style={{width: '325px'}}>
                    <ListGroup as="ul" style={{width: '100%'}}>
                        {chats.map((chat) => (
                            <ListGroup.Item
                                as="li"
                                key={chat.id}
                                active={selectedChatId === chat.id}
                                onClick={() => onSelectChat(chat)}
                                style={{cursor: 'pointer', width: '100%'}}
                            >

                                <Stack justifyContent='left'>
                                    <h4>{chat.name}</h4>
                                    <small>
                                        Created
                                        at {new Date(chat.created_at).toLocaleDateString()} {new Date(chat.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </small>
                                </Stack>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    {!selectedChatId && (
                        <Form onSubmit={handleCreateChat} style={{
                            position: 'fixed', bottom: 0, left: 0, background: '#f3f3f3',
                            width: '100%', height: '10vh'
                        }}>
                            <Grid display="flex" gap='1vh' padding='2vh'>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter chat name"
                                    onChange={(e) => setNewChatName(e.target.value)}
                                    value={newChatName}
                                    disabled={isCreating}
                                />
                                <Grid size="auto" display="flex">
                                    {isCreating ? (
                                        <Button loading>
                                            CREATE
                                        </Button>) : (
                                        <Button
                                            type="submit"
                                            disabled={isCreating || !newChatName.trim()}
                                        >
                                            CREATE
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </div>


            )}
        </>
    );
};

export default ChatList;