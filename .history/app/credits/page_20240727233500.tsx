import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getUserById } from "@/lib/actions/user.action";
import Checkout from "@/components/shared/Checkout";
import { NewSidebar } from "@/components/shared/new-sidebar";

const Credits = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  return (
    <div className="flex min-h-screen md:max-w-6xl">
      <NewSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <section className="credits-section max-w-6xl mx-auto">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <li key={plan.name} className="credits-item bg-white shadow-md rounded-lg p-6 flex flex-col">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <Image src={plan.icon} alt="check" width={50} height={50} />
                  <p className="plan-name text-xl font-bold">{plan.name}</p>
                  <p className="plan-price text-2xl font-bold text-primary">${plan.price}</p>
                  <p className="plan-credits text-lg text-gray-600">{plan.credits} Credits</p>
                </div>

                <ul className="inclusions-list space-y-2 mb-4">
                  {plan.inclusions.map((inclusion) => (
                    <li key={plan.name + inclusion.label} className="inclusion-item flex items-center gap-2">
                      <Image
                        src={`/assets/icons/${inclusion.isIncluded ? "check.svg" : "cross.svg"}`}
                        alt="check"
                        width={24}
                        height={24}
                      />
                      <p className="inclusion-label text-sm text-gray-600">{inclusion.label}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {plan.name === "Free" ? (
                    <Button variant="outline" className="w-full">
                      Free Consumable
                    </Button>
                  ) : (
                    <SignedIn>
                      <Checkout
                        plan={plan.name}
                        amount={plan.price}
                        credits={plan.credits}
                        buyerId={user._id}
                      />
                    </SignedIn>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Credits;