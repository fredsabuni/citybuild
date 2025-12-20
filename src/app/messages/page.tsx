'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { MessagingInterface, ComposeMessagePanel, Conversation, Message } from '@/components/notifications';

// Mock conversation data
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Downtown Office Complex Discussion',
    participants: [
      { id: 'user-gc-1', name: 'John Smith', role: 'General Contractor' },
      { id: 'user-sub-1', name: 'AquaFlow Plumbing', role: 'Subcontractor' },
    ],
    unreadCount: 2,
    projectId: 'proj-1',
    projectName: 'Downtown Office Complex',
  },
  {
    id: 'conv-2',
    title: 'Smart Home Project Clarifications',
    participants: [
      { id: 'user-gc-2', name: 'Sarah Johnson', role: 'General Contractor' },
      { id: 'user-sub-2', name: 'Elite Electrical', role: 'Subcontractor' },
    ],
    unreadCount: 0,
    projectId: 'proj-4',
    projectName: 'Smart Home Electrical Installation',
  },
  {
    id: 'conv-3',
    title: 'Payment Processing Support',
    participants: [
      { id: 'user-bank-1', name: 'Mike Chen', role: 'Bank Representative' },
      { id: 'user-sub-1', name: 'AquaFlow Plumbing', role: 'Subcontractor' },
    ],
    unreadCount: 1,
  },
  {
    id: 'conv-4',
    title: 'Material Delivery Coordination',
    participants: [
      { id: 'user-supplier-1', name: 'BuildMart Supply', role: 'Supplier' },
      { id: 'user-sub-3', name: 'GreenFlow Contractors', role: 'Subcontractor' },
      { id: 'user-gc-1', name: 'John Smith', role: 'General Contractor' },
    ],
    unreadCount: 0,
    projectId: 'proj-6',
    projectName: 'Luxury Hotel Plumbing Infrastructure',
  },
];

// Mock message data
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-gc-1',
    senderName: 'John Smith',
    senderRole: 'General Contractor',
    content: 'Hi there! I wanted to discuss the updated specifications for the plumbing installation. We\'ve made some changes to the layout that might affect your bid.',
    timestamp: new Date('2024-12-18T09:30:00'),
    isRead: true,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-sub-1',
    senderName: 'AquaFlow Plumbing',
    senderRole: 'Subcontractor',
    content: 'Thanks for reaching out! I\'d be happy to review the changes. Could you share the updated plans? I can adjust the bid accordingly.',
    timestamp: new Date('2024-12-18T10:15:00'),
    isRead: true,
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-gc-1',
    senderName: 'John Smith',
    senderRole: 'General Contractor',
    content: 'Absolutely! I\'ve uploaded the revised plans to the project files. The main changes are in the basement level - we\'ve added two additional restrooms.',
    timestamp: new Date('2024-12-18T10:45:00'),
    isRead: false,
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'user-gc-1',
    senderName: 'John Smith',
    senderRole: 'General Contractor',
    content: 'Also, the client wants to upgrade to smart water management systems. Let me know if this affects your timeline or pricing.',
    timestamp: new Date('2024-12-18T10:47:00'),
    isRead: false,
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    senderId: 'user-gc-2',
    senderName: 'Sarah Johnson',
    senderRole: 'General Contractor',
    content: 'Great work on the electrical bid! The homeowner is excited about the smart home integration. When can you start?',
    timestamp: new Date('2024-12-17T14:20:00'),
    isRead: true,
  },
  {
    id: 'msg-6',
    conversationId: 'conv-2',
    senderId: 'user-sub-2',
    senderName: 'Elite Electrical',
    senderRole: 'Subcontractor',
    content: 'Thank you! We can start as early as next Monday. I\'ll coordinate with the other trades to ensure smooth installation.',
    timestamp: new Date('2024-12-17T15:30:00'),
    isRead: true,
  },
  {
    id: 'msg-7',
    conversationId: 'conv-3',
    senderId: 'user-bank-1',
    senderName: 'Mike Chen',
    senderRole: 'Bank Representative',
    content: 'Your payment for the Residential Complex project has been processed. You should see the funds in your account within 2 business days.',
    timestamp: new Date('2024-12-17T16:45:00'),
    isRead: false,
  },
  {
    id: 'msg-8',
    conversationId: 'conv-4',
    senderId: 'user-supplier-1',
    senderName: 'BuildMart Supply',
    senderRole: 'Supplier',
    content: 'The specialty fixtures for the hotel project have arrived. We can schedule delivery for Thursday morning if that works for everyone.',
    timestamp: new Date('2024-12-16T11:20:00'),
    isRead: true,
  },
  {
    id: 'msg-9',
    conversationId: 'conv-4',
    senderId: 'user-sub-3',
    senderName: 'GreenFlow Contractors',
    senderRole: 'Subcontractor',
    content: 'Thursday morning works perfectly. We\'ll have the crew ready to receive and install. Please coordinate with site security for access.',
    timestamp: new Date('2024-12-16T12:15:00'),
    isRead: true,
  },
];

// Add last messages to conversations
const conversationsWithLastMessage = mockConversations.map(conv => {
  const lastMessage = mockMessages
    .filter(msg => msg.conversationId === conv.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  
  return {
    ...conv,
    lastMessage,
  };
});

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(conversationsWithLastMessage);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [composeOpen, setComposeOpen] = useState(false);
  const currentUserId = 'user-sub-1'; // Mock current user

  const handleSendMessage = (conversationId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      senderName: 'AquaFlow Plumbing', // Mock current user name
      senderRole: 'Subcontractor', // Mock current user role
      content,
      timestamp: new Date(),
      isRead: true,
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation's last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, lastMessage: newMessage }
          : conv
      )
    );
  };

  const handleMarkAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );

    setMessages(prev =>
      prev.map(msg =>
        msg.conversationId === conversationId && msg.senderId !== currentUserId
          ? { ...msg, isRead: true }
          : msg
      )
    );
  };

  const handleStartNewConversation = () => {
    setComposeOpen(true);
  };

  const handleSendNewMessage = (data: {
    recipients: any[];
    subject: string;
    message: string;
    projectId?: string;
    attachments?: File[];
    priority: 'low' | 'normal' | 'high' | 'urgent';
  }) => {
    // Create a new conversation
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      title: data.subject || 'New Conversation',
      participants: [
        { id: currentUserId, name: 'AquaFlow Plumbing', role: 'Subcontractor' },
        ...data.recipients,
      ],
      unreadCount: 0,
      projectId: data.projectId,
      projectName: data.projectId ? 'Selected Project' : undefined,
    };

    // Create the first message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: newConversationId,
      senderId: currentUserId,
      senderName: 'AquaFlow Plumbing',
      senderRole: 'Subcontractor',
      content: data.message,
      timestamp: new Date(),
      isRead: true,
    };

    // Update state
    setConversations(prev => [{ ...newConversation, lastMessage: newMessage }, ...prev]);
    setMessages(prev => [...prev, newMessage]);
    
    console.log('New message sent:', data);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with project stakeholders and team members
          </p>
        </div>

        {/* Messaging Interface */}
        <MessagingInterface
          conversations={conversations}
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onMarkAsRead={handleMarkAsRead}
          onStartNewConversation={handleStartNewConversation}
        />

        {/* Compose Message Panel */}
        <ComposeMessagePanel
          isOpen={composeOpen}
          onClose={() => setComposeOpen(false)}
          onSendMessage={handleSendNewMessage}
        />
      </div>
    </Layout>
  );
}