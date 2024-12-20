import Link from 'next/link';
import MenuLinks from '@/app/ui/dashboard/sidebar/menu-link';
import { PowerIcon } from '@heroicons/react/24/outline';
import SidebarLogo from '../../sidebar-logo';

export default function SideBar() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-[#59A04C] md:h-40"
        href="/dashboard"
      >
        <div className="w-32 md:w-40">
          <SidebarLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <MenuLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        {/* <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-[#C6F6BE] md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form> */}
      </div>
    </div>
  );
}
