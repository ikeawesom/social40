import PageWrapper from "@/src/components/PageWrapper";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Social 40",
  description: "Created by Ike Lim",
};

export default async function Home() {
  const links = [
    { name: "site", src: "globe", url: "https://ikeawesom.github.io/" },
    { name: "git", src: "github", url: "https://github.com/ikeawesom/" },
    {
      name: "linkedin",
      src: "linkedin",
      url: "https://www.linkedin.com/in/ike-lim/",
    },
  ];
  return (
    <>
      <PageWrapper>
        <div className="grid place-items-center h-[80vh]">
          <div className="flex flex-col gap-y-4 items-center justify-center">
            <h1 className="text-center text-4xl">
              Goodbye{" "}
              <span className="font-bold text-custom-primary">40 SAR</span>!
            </h1>
            <Image
              alt="Thank You"
              src="/images/thank_you.svg"
              width={300}
              height={300}
            />

            <h1 className="text-center text-custom-dark-text text-2xl">
              Thank you for all the support and for using{" "}
              <span className="font-bold">
                Social<span className="text-custom-primary">40</span>
              </span>
              !
            </h1>
            <div>
              Checkout my socials below
              <div className="flex items-center justify-center gap-3 mt-2">
                {links.map((item: any) => {
                  return (
                    <Link
                      key={item.name}
                      href={item.url}
                      className="hover:opacity-75 hover:-translate-y-1 duration-150"
                      target="_blank"
                    >
                      <Image
                        alt={item.name}
                        width={30}
                        height={30}
                        src={`/icons/links/${item.src}.svg`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
