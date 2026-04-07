import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { FileText, ShieldAlert, Megaphone, CalendarDays, UserCircle, AlertTriangle } from 'lucide-react';

interface Props {
    hasProfile: boolean;
    profileStatus: string | null;
    recentRequests?: Array<{ id: number; document_type: string; status: string; created_at: string }>;
    recentPayments?: Array<{ id: number; amount: string; status: string; paid_at: string | null }>;
    announcements: Array<{ id: number; title: string; category: string | null; published_at: string; is_pinned: boolean }>;
    upcomingEvents: Array<{ id: number; title: string; location: string | null; starts_at: string; status: string }>;
}

const statusColor = (s: string) => {
    switch (s) {
        case 'active': case 'Approved': case 'Released': case 'Paid': return 'default';
        case 'rejected': case 'Rejected': case 'Cancelled': return 'destructive';
        default: return 'secondary';
    }
};

export default function Dashboard({ hasProfile, profileStatus, recentRequests, recentPayments, announcements, upcomingEvents }: Props) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">My Dashboard</h2>}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Profile status banner */}
                {!hasProfile && (
                    <Card className="border-amber-500 bg-amber-50">
                        <CardContent className="flex items-center gap-4 py-4">
                            <AlertTriangle className="h-6 w-6 text-amber-600" />
                            <div className="flex-1">
                                <p className="font-medium text-amber-800">Complete Your Resident Profile</p>
                                <p className="text-sm text-amber-700">You need to register your resident profile to access barangay services.</p>
                            </div>
                            <Button asChild><Link href={route('resident-portal.profile')}>Register Now</Link></Button>
                        </CardContent>
                    </Card>
                )}
                {hasProfile && profileStatus === 'draft' && (
                    <Card className="border-blue-500 bg-blue-50">
                        <CardContent className="flex items-center gap-4 py-4">
                            <UserCircle className="h-6 w-6 text-blue-600" />
                            <div className="flex-1">
                                <p className="font-medium text-blue-800">Profile Status: Draft</p>
                                <p className="text-sm text-blue-700">Your profile is saved as a draft. Submit it for verification to access services.</p>
                            </div>
                            <Button asChild><Link href={route('resident-portal.profile')}>View Profile</Link></Button>
                        </CardContent>
                    </Card>
                )}
                {hasProfile && profileStatus === 'pending_verification' && (
                    <Card className="border-yellow-500 bg-yellow-50">
                        <CardContent className="flex items-center gap-4 py-4">
                            <UserCircle className="h-6 w-6 text-yellow-600" />
                            <div className="flex-1">
                                <p className="font-medium text-yellow-800">Profile Status: Pending Verification</p>
                                <p className="text-sm text-yellow-700">Your profile is under review by barangay staff. You'll be notified once verified.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {hasProfile && profileStatus === 'rejected' && (
                    <Card className="border-red-500 bg-red-50">
                        <CardContent className="flex items-center gap-4 py-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                            <div className="flex-1">
                                <p className="font-medium text-red-800">Profile Rejected</p>
                                <p className="text-sm text-red-700">Your profile was not approved. Please check the notes and resubmit.</p>
                            </div>
                            <Button variant="destructive" asChild><Link href={route('resident-portal.profile')}>View Details</Link></Button>
                        </CardContent>
                    </Card>
                )}

                {/* Quick access grid */}
                {hasProfile && profileStatus === 'active' && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Link href={route('resident-portal.profile')}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer"><CardContent className="flex flex-col items-center gap-2 pt-6"><UserCircle className="h-8 w-8 text-primary" /><span className="text-sm font-medium">My Profile</span></CardContent></Card>
                        </Link>
                        <Link href={route('resident-portal.document-requests.index')}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer"><CardContent className="flex flex-col items-center gap-2 pt-6"><FileText className="h-8 w-8 text-primary" /><span className="text-sm font-medium">Document Requests</span></CardContent></Card>
                        </Link>
                        <Link href={route('resident-portal.blotters.index')}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer"><CardContent className="flex flex-col items-center gap-2 pt-6"><ShieldAlert className="h-8 w-8 text-primary" /><span className="text-sm font-medium">Blotter Reports</span></CardContent></Card>
                        </Link>
                        <Link href={route('resident-portal.announcements.index')}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer"><CardContent className="flex flex-col items-center gap-2 pt-6"><Megaphone className="h-8 w-8 text-primary" /><span className="text-sm font-medium">Announcements</span></CardContent></Card>
                        </Link>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Document Requests */}
                    {recentRequests && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">Recent Document Requests</CardTitle>
                                <Button variant="ghost" size="sm" asChild><Link href={route('resident-portal.document-requests.index')}>View All</Link></Button>
                            </CardHeader>
                            <CardContent>
                                {recentRequests.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No requests yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {recentRequests.map(r => (
                                            <div key={r.id} className="flex items-center justify-between text-sm">
                                                <span>{r.document_type}</span>
                                                <Badge variant={statusColor(r.status)}>{r.status}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Announcements */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Latest Announcements</CardTitle>
                            <Button variant="ghost" size="sm" asChild><Link href={route('resident-portal.announcements.index')}>View All</Link></Button>
                        </CardHeader>
                        <CardContent>
                            {announcements.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No announcements.</p>
                            ) : (
                                <div className="space-y-3">
                                    {announcements.map(a => (
                                        <Link key={a.id} href={route('resident-portal.announcements.show', a.id)} className="block">
                                            <div className="flex items-center justify-between text-sm hover:text-primary transition-colors">
                                                <span className="font-medium">{a.title}</span>
                                                {a.category && <Badge variant="secondary">{a.category}</Badge>}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Upcoming Events</CardTitle>
                            <Button variant="ghost" size="sm" asChild><Link href={route('resident-portal.events.index')}>View All</Link></Button>
                        </CardHeader>
                        <CardContent>
                            {upcomingEvents.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No upcoming events.</p>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingEvents.map(e => (
                                        <Link key={e.id} href={route('resident-portal.events.show', e.id)} className="block">
                                            <div className="text-sm hover:text-primary transition-colors">
                                                <span className="font-medium">{e.title}</span>
                                                <div className="text-xs text-muted-foreground">{e.location} · {e.starts_at}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
