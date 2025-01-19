import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
import { NewSidebar } from "@/components/shared/new-sidebar";

interface ProfileProps {
  searchParams: {
    page?: string;
  };
}

const Profile = async ({ searchParams }: ProfileProps) => {
  try {
    const page = Number(searchParams?.page) || 1;
    const { userId } = auth();

    if (!userId) redirect("/sign-in");

    console.log('Attempting to fetch user with Clerk userId:', userId);
    const user = await getUserById(userId);
    
    if (!user) {
      console.error('User not found for Clerk userId:', userId);
      throw new Error('User not found');
    }
    console.log('Successfully found user:', user);

    return (
      <div className="flex min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <NewSidebar />
        <main className="ml-24 p-4 md:ml-64 md:p-8 w-full">
          <h1 className="text-4xl font-extrabold text-white mb-6">Profile</h1>

          <section className="profile flex flex-col gap-6">
            <div className="profile-balance bg-white rounded-lg border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <p className="text-2xl font-semibold text-gray-700">Credits Available</p>
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src="/assets/icons/coins.svg"
                  alt="coins"
                  width={50}
                  height={50}
                  className="w-12 h-12"
                />
                <h2 className="text-3xl font-bold text-gray-800">{user.creditBalance}</h2>
              </div>
            </div>

            <div className="profile-image-manipulation bg-white rounded-lg border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <p className="text-2xl font-semibold text-gray-700">Name History</p>
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src="/assets/icons/photo.svg"
                  alt="photo"
                  width={50}
                  height={50}
                  className="w-12 h-12"
                />
                <h2 className="text-3xl font-bold text-gray-800"> {/* Replace with actual data */}</h2>
              </div>
            </div>
          </section>

          <section className="mt-8 md:mt-14">
            {/* Additional content goes here */}
          </section>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Profile page error:', error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading profile</h1>
          <p className="text-gray-600 mb-4">There was an issue loading your profile data.</p>
          <p className="text-sm text-gray-500">Please try signing out and signing back in.</p>
        </div>
      </div>
    );
  }
};

export default Profile;
