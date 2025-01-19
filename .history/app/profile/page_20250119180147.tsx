import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getUserById, getAvailableDomainsForUser } from "@/lib/actions/user.action";
import { NewSidebar } from "@/components/shared/new-sidebar";

interface ProfileProps {
  searchParams: {
    page?: string;
  };
}

interface DomainStatus {
  name: string;
  status: string;
  zone: string;
  summary: string;
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

    // Fetch available domains
    const availableDomains = await getAvailableDomainsForUser(userId);

    return (
      <div className="flex min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <NewSidebar />
        <main className="ml-24 p-4 md:ml-64 md:p-8 w-full">
          <h1 className="text-4xl font-extrabold text-white mb-6">Profile</h1>

          <section className="profile flex flex-col gap-6">
            <div className="profile-balance bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">Credits Available</p>
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src="/assets/icons/coins.svg"
                  alt="coins"
                  width={50}
                  height={50}
                  className="w-12 h-12"
                />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.creditBalance}</h2>
              </div>
            </div>

            <div className="profile-image-manipulation bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">Name History</p>
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src="/assets/icons/photo.svg"
                  alt="photo"
                  width={50}
                  height={50}
                  className="w-12 h-12"
                />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white"> {/* Replace with actual data */}</h2>
              </div>
            </div>
          </section>

          <section className="mt-8 md:mt-14">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Available Domains Found</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(availableDomains as DomainStatus[]).map((domain, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{domain.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Zone: {domain.zone}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status: {domain.status}</p>
                  </div>
                ))}
                {availableDomains.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
                    No available domains found yet. Try searching for some domains!
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Profile page error:', error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error loading profile</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">There was an issue loading your profile data.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please try signing out and signing back in.</p>
        </div>
      </div>
    );
  }
};

export default Profile;
