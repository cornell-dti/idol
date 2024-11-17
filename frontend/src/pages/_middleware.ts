import { NextResponse, NextRequest } from 'next/server';
import { useHasAdminPermission } from '../components/Common/FirestoreDataProvider';

export default async function middleware(req: NextRequest) {
    const hasAdminPersissions = useHasAdminPermission();
    const { pathname } = req.nextUrl;
    if (pathname.startsWith('/admin') && !hasAdminPersissions) {
        return NextResponse.redirect('/');
    }
    return NextResponse.next();
}