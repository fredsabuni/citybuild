'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Badge } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface Conversation {
  id: string;
  title: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  projectId?: string;
  projectName?: string;
}

interface MessagingInterfaceProps {
  conversations: Conversation[];
  messages: Message[];
  currentUserId: string;
  onSendMessage: (conversationId: string, content: string) => void;
  onMarkAsRead: (conversationId: string) => void;
  onStartNewConversation: () => void;
}

export const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  conversations,
  messages,
  currentUserId,
  onSendMessage,
  onMarkAsRead,
  onStartNewConversation,
}) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (conv.projectName && conv.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages
    .filter(m => m.conversationId === selectedConversation)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversation && selectedConversationData && selectedConversationData.unreadCount > 0) {
      onMarkAsRead(selectedConversation);
    }
  }, [selectedConversation, selectedConversationData?.unreadCount, onMarkAsRead]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && selectedConversation) {
      onSendMessage(selectedConversation, messageInput.trim());
      setMessageInput('');
    }
  };

  const renderConversationItem = (conversation: Conversation) => (
    <div
      key={conversation.id}
      onClick={() => setSelectedConversation(conversation.id)}
      className={`p-3 border-b border-border cursor-pointer hover:bg-secondary transition-colors ${
        selectedConversation === conversation.id ? 'bg-secondary border-l-4 border-l-primary' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 border border-border">
          <UserIcon className="w-5 h-5 text-muted-foreground" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium truncate">{conversation.title}</h4>
            {conversation.unreadCount > 0 && (
              <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
          
          {conversation.projectName && (
            <p className="text-xs text-muted-foreground truncate">
              Project: {conversation.projectName}
            </p>
          )}
          
          {conversation.lastMessage && (
            <div className="mt-1">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {conversation.lastMessage.senderName}: {conversation.lastMessage.content}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatRelativeTime(conversation.lastMessage.timestamp)}
              </p>
            </div>
          )}
          
          <div className="flex items-center mt-2 space-x-1">
            {conversation.participants.slice(0, 3).map((participant) => (
              <Badge key={participant.id} variant="outline" className="text-xs">
                {participant.role}
              </Badge>
            ))}
            {conversation.participants.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{conversation.participants.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === currentUserId;
    
    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
          {!isCurrentUser && (
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center border border-border">
                <UserIcon className="w-3 h-3 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium">{message.senderName}</span>
              <Badge variant="outline" className="text-xs">
                {message.senderRole}
              </Badge>
            </div>
          )}
          
          <div
            className={`px-4 py-2 rounded-lg ${
              isCurrentUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground border border-border'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={`text-xs p-2 rounded border ${
                      isCurrentUser ? 'bg-primary-foreground/20' : 'bg-muted'
                    }`}
                  >
                    📎 {attachment.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <p className={`text-xs text-muted-foreground mt-1 ${
            isCurrentUser ? 'text-right' : 'text-left'
          }`}>
            {formatRelativeTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[600px] border-2 border-border rounded-lg overflow-hidden bg-card">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r-2 border-border flex flex-col bg-card">
        {/* Header */}
        <div className="p-4 border-b-2 border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Messages</h3>
            <Button size="sm" onClick={onStartNewConversation}>
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border-2 border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(renderConversationItem)
          ) : (
            <div className="p-8 text-center">
              <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b-2 border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedConversationData.title}</h3>
                  {selectedConversationData.projectName && (
                    <p className="text-sm text-muted-foreground">
                      Project: {selectedConversationData.projectName}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    {selectedConversationData.participants.map((participant) => (
                      <Badge key={participant.id} variant="outline" className="text-xs">
                        {participant.name} ({participant.role})
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <EllipsisVerticalIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {conversationMessages.length > 0 ? (
                <>
                  {conversationMessages.map(renderMessage)}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Start the conversation</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-border bg-card">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border-2 border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <Button type="submit" disabled={!messageInput.trim()} variant="info">
                  <PaperAirplaneIcon className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};