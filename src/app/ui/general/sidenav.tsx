// import Link from 'next/link';
import NavLinks from '@/app/ui/general/nav-links';
import SignOutButton from '@/app/ui/general/sign-out/signout'

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* // ... */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />

        <div className="hidden h-auto w-full grow rounded-md bg-gray-800 md:block"></div>
        <SignOutButton />
      </div>
    </div>
  );
}