'use client';

import { useState, useRef } from 'react';
import { SlidePanel } from '@/components/layout';
import { Button, Badge } from '@/components/ui';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  UserIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentIcon,
  PhotoIcon,
  PaperClipIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface Participant {
  id: string;
  name: string;
  role: string;
  email: string;
  company?: string;
  avatar?: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

interface ComposeMessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (data: {
    recipients: Participant[];
    subject: string;
    message: string;
    projectId?: string;
    attachments?: File[];
    priority: 'low' | 'normal' | 'high' | 'urgent';
  }) => void;
}

// Mock data for participants
const mockParticipants: Participant[] = [
  {
    id: 'user-gc-1',
    name: 'John Smith',
    role: 'General Contractor',
    email: 'john.smith@downtownconst.com',
    company: 'Downtown Construction LLC',
  },
  {
    id: 'user-sub-1',
    name: 'Mike Johnson',
    role: 'Subcontractor',
    email: 'mike@aquaflowplumbing.com',
    company: 'AquaFlow Plumbing',
  },
  {
    id: 'user-sub-2',
    name: 'Sarah Wilson',
    role: 'Subcontractor',
    email: 'sarah@eliteelectrical.com',
    company: 'Elite Electrical',
  },
  {
    id: 'user-supplier-1',
    name: 'David Chen',
    role: 'Supplier',
    email: 'david@buildmart.com',
    company: 'BuildMart Supply Co.',
  },
  {
    id: 'user-bank-1',
    name: 'Lisa Rodriguez',
    role: 'Bank Representative',
    email: 'lisa.rodriguez@citybank.com',
    company: 'City Bank',
  },
  {
    id: 'user-gc-2',
    name: 'Robert Taylor',
    role: 'General Contractor',
    email: 'robert@premiumbuilders.com',
    company: 'Premium Builders Inc.',
  },
];

// Mock projects data
const mockProjects: Project[] = [
  { id: 'proj-1', name: 'Downtown Office Complex', status: 'active' },
  { id: 'proj-2', name: 'Residential Complex Phase 1', status: 'active' },
  { id: 'proj-3', name: 'Warehouse Renovation', status: 'completed' },
  { id: 'proj-4', name: 'Smart Home Electrical Installation', status: 'active' },
  { id: 'proj-5', name: 'Luxury Hotel Plumbing Infrastructure', status: 'bidding' },
];

export const ComposeMessagePanel: React.FC<ComposeMessagePanelProps> = ({
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const [selectedRecipients, setSelectedRecipients] = useState<Participant[]>([]);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredParticipants = mockParticipants.filter(participant =>
    !selectedRecipients.find(r => r.id === participant.id) &&
    (participant.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
     participant.email.toLowerCase().includes(recipientSearch.toLowerCase()) ||
     participant.company?.toLowerCase().includes(recipientSearch.toLowerCase()) ||
     participant.role.toLowerCase().includes(recipientSearch.toLowerCase()))
  );

  const handleAddRecipient = (participant: Participant) => {
    setSelectedRecipients(prev => [...prev, participant]);
    setRecipientSearch('');
    setShowRecipientDropdown(false);
  };

  const handleRemoveRecipient = (participantId: string) => {
    setSelectedRecipients(prev => prev.filter(r => r.id !== participantId));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!selectedRecipients.length || !message.trim()) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onSendMessage({
        recipients: selectedRecipients,
        subject: subject || 'New Message',
        message: message.trim(),
        projectId: selectedProject || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
        priority,
      });

      // Reset form
      setSelectedRecipients([]);
      setSubject('');
      setMessage('');
      setSelectedProject('');
      setPriority('normal');
      setAttachments([]);
      
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setSelectedRecipients([]);
    setRecipientSearch('');
    setShowRecipientDropdown(false);
    setSubject('');
    setMessage('');
    setSelectedProject('');
    setPriority('normal');
    setAttachments([]);
    onClose();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      direction="right"
      width="lg"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PaperAirplaneIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Compose Message</h2>
              <p className="text-sm text-muted-foreground">Send a message to project stakeholders</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Recipients */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Recipients <span className="text-destructive">*</span>
            </label>
            
            {/* Selected Recipients */}
            {selectedRecipients.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{recipient.name}</span>
                    <button
                      onClick={() => handleRemoveRecipient(recipient.id)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recipient Search */}
            <div className="relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={recipientSearch}
                  onChange={(e) => {
                    setRecipientSearch(e.target.value);
                    setShowRecipientDropdown(true);
                  }}
                  onFocus={() => setShowRecipientDropdown(true)}
                  placeholder="Search for people to message..."
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Dropdown */}
              {showRecipientDropdown && filteredParticipants.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredParticipants.map((participant) => (
                    <button
                      key={participant.id}
                      onClick={() => handleAddRecipient(participant)}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {participant.role} • {participant.company}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Related Project (Optional)</label>
            <div className="relative">
              <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a project (optional)</option>
                {mockProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Priority</label>
            <div className="flex space-x-2">
              {(['low', 'normal', 'high', 'urgent'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    priority === p
                      ? `${getPriorityColor(p)} text-white`
                      : 'bg-secondary text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Message <span className="text-destructive">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {message.length} characters
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Attachments</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperClipIcon className="w-4 h-4 mr-2" />
                Add Files
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            />

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <DocumentIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="border-t border-border p-6 bg-card">
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
              disabled={isLoading}
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSend}
              disabled={!selectedRecipients.length || !message.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SlidePanel>
  );
};