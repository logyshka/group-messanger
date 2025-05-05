import React, {useState} from 'react';
import {messagesAPI} from '../../services/api';
import Form from "react-bootstrap/Form";
import {Grid} from "@mui/joy";
import Button from "@mui/material/Button";
import {MdCancel} from "react-icons/md";
import {FaSave} from "react-icons/fa";
import {ButtonGroup} from "@mui/material";

const EditMessageForm = ({chatId, message, onMessageUpdated, onCancel}) => {
    const [newContent, setNewContent] = useState(message.content);
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!newContent.trim()) return;

        setUpdating(true);

        try {
            const updated = await messagesAPI.updateMessage(chatId, message.id, newContent.trim());
            if (onMessageUpdated) {
                onMessageUpdated(updated);
            }
        } catch (err) {
            console.error('Update error:', err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Form onSubmit={handleUpdate}>
            <Grid display="flex" gap='1vh' padding='2vh'>
                <Form.Control
                    type="text"
                    placeholder="Enter message..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    disabled={updating}
                    size='grow'
                />
                <ButtonGroup variant="contained">
                    {
                        updating ? (
                            <Button loading></Button>
                        ) : (
                            <Button color='success' type="submit" disabled={updating || !newContent.trim()}>
                                <FaSave size={15}/>
                            </Button>
                        )
                    }
                    <Button color='error' onClick={onCancel} disabled={updating}>
                        <MdCancel size={15}/>
                    </Button>
                </ButtonGroup>
            </Grid>
        </Form>

    );
};

export default EditMessageForm;
