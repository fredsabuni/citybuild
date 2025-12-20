'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { UserProfile } from '@/components/auth';

export default function ProfilePage() {
  const handleEditProfile = () => {
    // In a real app, this would open an edit form or navigate to an edit page
    console.log('Edit profile clicked');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        
        <UserProfile onEditProfile={handleEditProfile} />
      </div>
    </Layout>
  );
}