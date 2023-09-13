import Link from "next/link";

const navigation = {
  company: [
    { name: "pro", href: "/pro" },
    { name: "blog", href: "/blog" },
    { name: "create", href: "/create" },
    { name: "support", href: "mailto:hello@chetanverma.com" },
  ],
  legal: [{ name: "Privacy", href: "/privacy" }],
};

export default function Footer() {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="flex flex-col items-start justify-between gap-y-10 lg:flex-row lg:gap-y-0">
        <div className="space-y-2">
          <Link href="/" className="flex items-center text-xl font-bold">
            Superpolls{" "}
          </Link>
          <p className="text-sm text-gray-500">
            Your Voice Matters: The Ultimate Polling Experience
          </p>
        </div>
        <div className="flex items-start gap-x-12">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Company</h3>
            <div className="mt-2 flex flex-col space-y-2">
              {navigation.company.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Legal</h3>
            <div className="mt-2 flex flex-col space-y-2">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-900/10 pt-8 sm:mt-20 lg:flex-row">
        <p className="text-xs leading-5 text-gray-500">
          &copy; 2022 superpolls, Inc. All rights reserved.
        </p>
        <p className="text-center text-xs leading-5 text-gray-500">
          Made with ❤️ by{" "}
          <Link
            href="https://chetanverma.com/"
            className="text-gray-500 hover:text-gray-900"
          >
            chetanverma
          </Link>{" "}
          and designed by{" "}
          <Link href="https://www.lovleenthapar.com/">lovleenthapar</Link>
        </p>
      </div>
    </footer>
  );
}
