// import { fetchInvoicesPages } from '@/app/lib/data';
import CardWrapper from '@/app/ui/dashboard/cards';
import { Suspense } from 'react';
import { CardsSkeleton, RoomListTableSkeleton } from '@/app/ui/skeletons';
import Table from '@/app/ui/dashboard/table';
import Pagination from '@/app/ui/dashboard/pagination';
import Search from '@/app/ui/search';
import { CreateBooking } from '@/app/ui/dashboard/buttons';
import { fetchBookingPages } from '../lib/data';


export default async function Page({
  searchParams,
}: {
    searchParams?: {
      query?: string;
      page?: string;
    };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchBookingPages(query);
  return (
    <div className='w-full'>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <h2 className='mt-7 mb-4 text-xl md:text-2xl'>
        Bookings
      </h2>
      <div className="flex items-center justify-between gap-2">
        <Search placeholder="Search Bookings..." />
        <CreateBooking />
      </div>
      <Suspense key={query + currentPage} fallback={<RoomListTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}