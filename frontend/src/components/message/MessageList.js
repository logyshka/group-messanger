import React, {useEffect, useRef, useState} from 'react';
import {messagesAPI} from '../../services/api';
import {useAuth} from '../../contexts/AuthContext';
import {Stack} from "@mui/material";
import {MdDelete, MdEdit} from "react-icons/md";
import {Badge} from "react-bootstrap";

const PAGE_SIZE = 10;

const MessageList = ({chatId, onEditMessage, onDeleteMessage, refreshTrigger}) => {
    const [messages, setMessages] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const {currentUser} = useAuth();

    const containerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const loadingRef = useRef(false);

    const fetchMessages = async (newOffset = 0, append = false) => {
        try {
            loadingRef.current = true;
            const data = await messagesAPI.getMessages(chatId, newOffset, PAGE_SIZE);

            if (data.length === 0) {
                setLoading(false);
                loadingRef.current = false;
                return;
            }
            if (data.length < PAGE_SIZE) setHasMore(false);

            setMessages(prev =>
                append ? [...data, ...prev] : data
            );
            setOffset(prev => prev + data.length);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    };

    useEffect(() => {
        if (!chatId) return;
        setMessages([]);
        setOffset(0);
        setHasMore(true);
        setLoading(true);
        fetchMessages(0, false).then(() => {
            scrollToBottom();
        });
    }, [chatId, refreshTrigger]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const lastMessageId = messages.length === 0 ? 0 : messages[messages.length - 1].id;
            const data = await messagesAPI.getNewMessages(chatId, lastMessageId);
            const newMessages = data.filter(m => !messages.some(msg => msg.id === m.id));
            if (newMessages.length > 0) {
                setMessages(prev => [...prev, ...newMessages]);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [chatId, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    const handleScroll = async () => {
        const el = containerRef.current;
        if (el.scrollTop === 0 && hasMore && !loadingRef.current) {
            const prevHeight = el.scrollHeight;
            await fetchMessages(offset, true);
            setTimeout(() => {
                el.scrollTop = el.scrollHeight - prevHeight;
            }, 50);
        }
    };


    if (!chatId) {
        return <div className="no-chat-selected">Select a chat to view messages</div>;
    }

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{
                overflowY: 'auto',
                display: 'flex',
                minWidth: '100%',
                height: '500px'
            }}
        >
            <Stack spacing={1} minWidth='100%'>
                {messages.map(message => (
                    <Message
                        key={message.id}
                        message={message}
                        isOwnMessage={message.user.username === currentUser.username}
                        onEdit={() => onEditMessage(message)}
                        onDelete={() => onDeleteMessage(message)}
                    />
                ))}
                <div ref={messagesEndRef}/>
            </Stack>
        </div>


    );
};

const Message = ({message, isOwnMessage, onEdit, onDelete}) => {
    let messageTime = new Date(message.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    return (
        <Stack
            spacing={1}
            bgcolor={isOwnMessage ? '#d1e7ff' : '#f3f3f3'}
            padding={1}
            borderRadius={2}
            width='100%'
            maxWidth='80%'
            minWidth='80%'
            alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
        >
            <p>{message.content}</p>
            <div className='d-flex text-secondary justify-content-between small'>
                <span>
                    @{message.user.username}
                </span>
                <span>
                    {messageTime}
                </span>
            </div>
            {isOwnMessage && (
                <div className='d-flex gap-2 justify-content-end'>
                    <Badge className='btn' bg='primary' onClick={onEdit}><MdEdit width={20} height={20}/></Badge>
                    <Badge className='btn' bg='danger' onClick={onDelete}><MdDelete/></Badge>
                </div>
            )}
        </Stack>

    );
};

export default MessageList;
