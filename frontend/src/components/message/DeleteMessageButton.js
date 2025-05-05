import React, { useState } from 'react';
import { messagesAPI } from '../../services/api';

const DeleteMessageButton = ({ chatId, messageId, onMessageDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    setDeleting(true);
    setError('');

    try {
      await messagesAPI.deleteMessage(chatId, messageId);
      if (onMessageDeleted) {
        onMessageDeleted(messageId);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete message');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="delete-message">
      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default DeleteMessageButton;
