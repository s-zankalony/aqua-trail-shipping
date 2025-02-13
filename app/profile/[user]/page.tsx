import { getUserData } from '@/utils/actions';
import React from 'react';

async function ProfilePage() {
  const user = await getUserData();
  return <div>ProfilePage</div>;
}

export default ProfilePage;
