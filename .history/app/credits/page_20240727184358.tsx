import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getUserById } from "@/lib/actions/user.action";
import Checkout from "@/components/shared/Checkout";
import { new-sidebartsxtsx } from "@/components/shared/Sidebar";

const Credits = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  return (
    <><NewSidebar />
      <section className="credits-section">
        <ul className="credits-list">
          {plans.map((plan) => (
            <li key={plan.name} className="credits-item">
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="plan-name">{plan.name}</p>
                <p className="plan-price">${plan.price}</p>
                <p className="plan-credits">{plan.credits} Credits</p>
              </div>

              {/* Inclusions */}
              <ul className="inclusions-list">
                {plan.inclusions.map((inclusion) => (
                  <li key={plan.name + inclusion.label} className="inclusion-item">
                    <Image
                      src={`/assets/icons/${inclusion.isIncluded ? "check.svg" : "cross.svg"}`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="inclusion-label">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button variant="outline" className="credits-btn">
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
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Credits;

