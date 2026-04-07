import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    Users,
    Home,
    FileText,
    CreditCard,
    UserCog,
    Megaphone,
    ShieldAlert,
    CalendarDays,
    TrendingUp,
    Clock,
} from 'lucide-react';

interface StatsCard {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: string;
}

export default function Dashboard() {
    const user = usePage().props.auth.user;

    const userRoles = user.roles?.map((r) => r.name) || [];
    const hasRole = (role: string) => userRoles.includes(role);
    const isAdmin = hasRole('admin');
    const isStaff = hasRole('staff');

    const getRoleLabel = () => {
        if (isAdmin) return 'Administrator';
        if (isStaff) return 'Barangay Staff';
        if (hasRole('resident')) return 'Resident';
        return 'User';
    };

    const stats: StatsCard[] = [
        {
            title: 'Total Residents',
            value: '—',
            description: 'Registered residents',
            icon: <Users className="h-5 w-5 text-blue-600" />,
            trend: '+0 this month',
        },
        {
            title: 'Households',
            value: '—',
            description: 'Total households',
            icon: <Home className="h-5 w-5 text-green-600" />,
            trend: '+0 this month',
        },
        {
            title: 'Document Requests',
            value: '—',
            description: 'Pending requests',
            icon: <FileText className="h-5 w-5 text-orange-600" />,
            trend: '0 pending',
        },
        {
            title: 'Payments',
            value: '—',
            description: 'Total collected',
            icon: <CreditCard className="h-5 w-5 text-purple-600" />,
            trend: '₱0 this month',
        },
    ];

    const quickLinks = [
        { label: 'Officials', icon: <UserCog className="h-4 w-4" />, href: '/officials', roles: ['admin'] },
        { label: 'Announcements', icon: <Megaphone className="h-4 w-4" />, href: '/announcements', roles: [] },
        { label: 'Blotter', icon: <ShieldAlert className="h-4 w-4" />, href: '/blotters', roles: ['admin', 'staff'] },
        { label: 'Events', icon: <CalendarDays className="h-4 w-4" />, href: '/events', roles: [] },
    ].filter((item) => item.roles.length === 0 || item.roles.some((r) => hasRole(r)));

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back, {user.name}
                    </h1>
                    <p className="text-muted-foreground">
                        Here's what's happening in your barangay today.
                    </p>
                </div>

                {/* Stats Grid */}
                {(isAdmin || isStaff) && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    {stat.icon}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <TrendingUp className="h-3 w-3" />
                                        {stat.trend}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="grid gap-4 lg:grid-cols-7">
                    {/* Recent Activity */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="text-base">Recent Activity</CardTitle>
                            <CardDescription>Latest actions across the platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 rounded-lg border p-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 space-y-0.5">
                                        <p className="text-sm font-medium">No recent activity</p>
                                        <p className="text-xs text-muted-foreground">
                                            Activity will appear here once modules are populated.
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">Info</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-base">Quick Access</CardTitle>
                            <CardDescription>Jump to a module</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {quickLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        {link.icon}
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Role info for residents */}
                {hasRole('resident') && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Your Information</CardTitle>
                            <CardDescription>Account details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="text-sm font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Role</p>
                                    <Badge variant="outline">{getRoleLabel()}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
