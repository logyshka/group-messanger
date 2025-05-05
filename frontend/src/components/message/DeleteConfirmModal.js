import React from 'react';
import {messagesAPI} from '../../services/api';
import {Modal} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import {Grid} from "@mui/joy";

const DeleteConfirmModal = ({message, chatId, onConfirm, onCancel, show}) => {
    const handleDelete = async () => {
        try {
            await messagesAPI.deleteMessage(chatId, message.id);
            onConfirm();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };
    return (
        <Modal
            show={show}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header>
                <Modal.Title id="example-custom-modal-styling-title">
                    This message will be deleted
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {message.content.substring(0, 100)}...
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Grid display="flex" alignItems='center' justifyContent='center' gap={1}>
                    <Grid size='grow'>
                        <Button variant='danger' onClick={handleDelete}>Delete</Button>
                    </Grid>
                    <Grid size='grow'>
                        <Button variant='secondary' onClick={onCancel}>Cancel</Button>
                    </Grid>
                </Grid>

            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmModal;
