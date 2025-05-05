import React, {useState} from 'react';
import {messagesAPI} from '../../services/api';
import './MessageForm.css';
import {FiSend} from "react-icons/fi";
import Button from "@mui/joy/Button";
import {Grid} from "@mui/joy";
import Form from "react-bootstrap/Form";

const MessageForm = ({chatId, onMessageSent}) => {
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim() || !chatId) {
            return;
        }

        setSending(true);
        setError('');

        try {
            const newMessage = await messagesAPI.createMessage(chatId, content.trim());
            setContent('');
            if (onMessageSent) {
                onMessageSent(newMessage);
            }
        } catch (error) {
            setError('Failed to send message');
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };
    return (
        <Form onSubmit={handleSubmit}>
            <Grid display="flex" gap='1vh' padding='2vh'>
                <Form.Control
                    type="text"
                    placeholder="Enter message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={sending || !chatId}
                    autoFocus='true'
                />
                <Grid size="auto" display="flex">
                    {
                        sending ? (
                            <Button loading></Button>
                        ) : (
                            <Button type="submit" disabled={sending || !content.trim() || !chatId}>
                                <FiSend size={25}></FiSend>
                            </Button>
                        )
                    }
                </Grid>
            </Grid>
        </Form>
    );
};

export default MessageForm;