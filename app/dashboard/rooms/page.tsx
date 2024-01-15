// import { fetchInvoicesPages } from '@/app/lib/data';
import { Suspense } from 'react';
import { RoomListTableSkeleton } from '@/app/ui/skeletons';
import Table from '@/app/ui/dashboard/rooms/table';
import Pagination from '@/app/ui/dashboard/pagination';
import Search from '@/app/ui/search';
import { CreateRoom } from '@/app/ui/dashboard/rooms/buttons';
import { fetchRoomPages } from '@/app/lib/data';


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

    const totalPages = await fetchRoomPages(query);
    return (
        <div className='w-full'>
            <h1 className={`mb-4 text-xl md:text-2xl`}>
                Meeting Rooms
            </h1>
            <div className="flex items-center justify-between gap-2 md:mt-8">
            <Search placeholder="Search Rooms..." />
            <CreateRoom />
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