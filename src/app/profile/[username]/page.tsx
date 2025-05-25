import UserProfilePage from "@/components/profile/UserProfilePage";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return <UserProfilePage username={params.username} />;
} 