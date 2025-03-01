import React, { useState } from 'react';
import { FiTrash2, FiRefreshCw, FiEdit, FiSend, FiPlus } from 'react-icons/fi';
import './Messages.css';

const Messages = () => {
  // Mock messages data
  const mockMessages = [
    {
      id: 1,
      sender: 'Admin',
      subject: 'Welcome to the Task Management System',
      message: 'Welcome to our new task management system! Please let me know if you have any questions or need assistance getting started.',
      date: '2023-06-01 09:30 AM',
      read: true
    },
    {
      id: 2,
      sender: 'John Smith',
      subject: 'Project Status Update',
      message: 'Just wanted to update you on the project status. We\'ve completed the initial phase and are now moving to the next stage. Let me know if you have any questions.',
      date: '2023-06-02 02:15 PM',
      read: false
    },
    {
      id: 3,
      sender: 'Jane Doe',
      subject: 'Meeting Reminder',
      message: 'This is a reminder that we have a team meeting scheduled for tomorrow at 10:00 AM. Please prepare your weekly updates.',
      date: '2023-06-03 11:05 AM',
      read: false
    }
  ];

  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [composeData, setComposeData] = useState({
    recipient: '',
    subject: '',
    message: ''
  });

  const handleMessageClick = (message) => {
    // Mark message as read
    if (!message.read) {
      const updatedMessages = messages.map(msg => 
        msg.id === message.id ? { ...msg, read: true } : msg
      );
      setMessages(updatedMessages);
    }
    setSelectedMessage(message);
    setShowComposeForm(false);
  };

  const handleDeleteMessage = (id) => {
    const updatedMessages = messages.filter(message => message.id !== id);
    setMessages(updatedMessages);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
  };

  const handleRefresh = () => {
    // In a real app, this would fetch new messages from the server
    alert('Refreshing messages... (This would fetch from API in a real app)');
  };

  const handleComposeShow = () => {
    setShowComposeForm(true);
    setSelectedMessage(null);
  };

  const handleComposeChange = (e) => {
    const { name, value } = e.target;
    setComposeData({
      ...composeData,
      [name]: value
    });
  };

  const handleComposeSend = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!composeData.recipient.trim() || !composeData.subject.trim() || !composeData.message.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    // In a real app, this would send the message to the server
    const newMessage = {
      id: messages.length + 1,
      sender: 'Me',
      recipient: composeData.recipient,
      subject: composeData.subject,
      message: composeData.message,
      date: new Date().toLocaleString(),
      read: true,
      sent: true
    };
    
    // Add to messages (for demo purposes)
    setMessages([newMessage, ...messages]);
    
    // Reset form
    setComposeData({
      recipient: '',
      subject: '',
      message: ''
    });
    
    setShowComposeForm(false);
    alert('Message sent! (This would be handled by API in a real app)');
  };

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <div className="messages-actions">
          <button className="btn btn-primary compose-btn" onClick={handleComposeShow}>
            <FiPlus /> Compose
          </button>
          <button className="btn btn-icon refresh-btn" onClick={handleRefresh}>
            <FiRefreshCw />
          </button>
        </div>
        
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="no-messages">No messages found</div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`message-item ${message.read ? '' : 'unread'} ${selectedMessage && selectedMessage.id === message.id ? 'selected' : ''}`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="message-sender">{message.sender}</div>
                <div className="message-subject">{message.subject}</div>
                <div className="message-date">{message.date}</div>
                <button 
                  className="message-delete" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMessage(message.id);
                  }}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="messages-content">
        {showComposeForm ? (
          <div className="compose-message">
            <h2>Compose New Message</h2>
            <form onSubmit={handleComposeSend}>
              <div className="form-group">
                <label htmlFor="recipient">To:</label>
                <input
                  type="text"
                  id="recipient"
                  name="recipient"
                  value={composeData.recipient}
                  onChange={handleComposeChange}
                  placeholder="Recipient's name or email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={composeData.subject}
                  onChange={handleComposeChange}
                  placeholder="Message subject"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={composeData.message}
                  onChange={handleComposeChange}
                  placeholder="Type your message here..."
                  rows="10"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowComposeForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiSend /> Send Message
                </button>
              </div>
            </form>
          </div>
        ) : selectedMessage ? (
          <div className="message-detail">
            <div className="message-header">
              <h2>{selectedMessage.subject}</h2>
              <div className="message-meta">
                <div className="message-from">From: {selectedMessage.sender}</div>
                <div className="message-time">Date: {selectedMessage.date}</div>
              </div>
            </div>
            <div className="message-body">
              {selectedMessage.message}
            </div>
            <div className="message-actions">
              <button className="btn btn-primary">
                <FiEdit /> Reply
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="no-message-selected">
            <p>Select a message to view or compose a new message</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages; 