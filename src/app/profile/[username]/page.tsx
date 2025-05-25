import UserProfilePage from "@/components/profile/UserProfilePage";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  return <UserProfilePage username={username} />;
} 