import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Home,
    UserCog,
    FileText,
    CreditCard,
    Megaphone,
    ShieldAlert,
    CalendarDays,
    ChevronLeft,
    Menu,
    LogOut,
    UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/Components/ui/tooltip';
import FlashMessages from '@/Components/FlashMessages';

interface NavItem {
    label: string;
    href: string;
    routeName: string;
    icon: ReactNode;
    roles?: string[];
}

const navItems: NavItem[] = [
    // Admin/Staff back-office
    {
        label: 'Dashboard',
        href: '/dashboard',
        routeName: 'dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['admin', 'staff'],
    },
    {
        label: 'Residents',
        href: '/residents',
        routeName: 'resident.*',
        icon: <Users className="h-5 w-5" />,
        roles: ['admin', 'staff'],
    },
    {
        label: 'Households',
        href: '/households',
        routeName: 'household.*',
        icon: <Home className="h-5 w-5" />,
        roles: ['admin', 'staff'],
    },
    {
        label: 'Officials',
        href: '/officials',
        routeName: 'official.*',
        icon: <UserCog className="h-5 w-5" />,
        roles: ['admin'],
    },
    {
        label: 'Document Requests',
        href: '/documentrequests',
        routeName: 'documentrequest.*',
        icon: <FileText className="h-5 w-5" />,
        roles: ['admin', 'staff'],
    },
    {
        label: 'Payments',
        href: '/payments',
        routeName: 'payment.*',
        icon: <CreditCard className="h-5 w-5" />,
        roles: ['admin', 'staff'],
    },
    {
        label: 'Announcements',
        href: '/announcements',
        routeName: 'announcement.*',
        icon: <Megaphone className="h-5 w-5" />,
        roles: ['admin', 'staff'],
    },
    {
        label: 'Blotter',
        href: '/blotters',
        routeName: 'blotter.*',
        icon: <ShieldAlert className="h-5 w-5" />,
        roles: ['admin', 'staff'],
    },
    {
        label: 'Events',
        href: '/events',
        routeName: 'event.*',
        icon: <CalendarDays className="h-5 w-5" />,
        roles: ['admin', 'staff'],
    },

    // Resident self-service portal
    {
        label: 'Dashboard',
        href: '/resident/dashboard',
        routeName: 'resident-portal.dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['resident'],
    },
    {
        label: 'My Profile',
        href: '/resident/profile',
        routeName: 'resident-portal.profile.*',
        icon: <UserCircle className="h-5 w-5" />,
        roles: ['resident'],
    },
    {
        label: 'Document Requests',
        href: '/resident/document-requests',
        routeName: 'resident-portal.document-requests.*',
        icon: <FileText className="h-5 w-5" />,
        roles: ['resident'],
    },
    {
        label: 'Blotter Reports',
        href: '/resident/blotters',
        routeName: 'resident-portal.blotters.*',
        icon: <ShieldAlert className="h-5 w-5" />,
        roles: ['resident'],
    },
    {
        label: 'Announcements',
        href: '/resident/announcements',
        routeName: 'resident-portal.announcements.*',
        icon: <Megaphone className="h-5 w-5" />,
        roles: ['resident'],
    },
    {
        label: 'Events',
        href: '/resident/events',
        routeName: 'resident-portal.events.*',
        icon: <CalendarDays className="h-5 w-5" />,
        roles: ['resident'],
    },
];

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const userRoles = user.roles?.map((r: { name: string }) => r.name) || [];

    const hasRole = (role: string) => userRoles.includes(role);

    const getRoleLabel = () => {
        if (hasRole('admin')) return 'Administrator';
        if (hasRole('staff')) return 'Barangay Staff';
        if (hasRole('resident')) return 'Resident';
        return 'User';
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const filteredNav = navItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.some((role) => hasRole(role));
    });

    const isActive = (routeName: string) => {
        try {
            return route().current(routeName);
        } catch {
            return false;
        }
    };

    const sidebarContent = (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className={cn(
                "flex h-16 items-center border-b border-sidebar-border px-4",
                collapsed ? "justify-center" : "gap-3"
            )}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <LayoutDashboard className="h-4 w-4" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-sidebar-foreground">Barangay</span>
                        <span className="text-xs text-muted-foreground">Service Platform</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                <TooltipProvider delayDuration={0}>
                    {filteredNav.map((item) => {
                        const active = isActive(item.routeName);
                        const linkContent = (
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    active
                                        ? "bg-sidebar-accent text-sidebar-primary"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    collapsed && "justify-center px-2"
                                )}
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.icon}
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );

                        if (collapsed) {
                            return (
                                <Tooltip key={item.routeName}>
                                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                                    <TooltipContent side="right">{item.label}</TooltipContent>
                                </Tooltip>
                            );
                        }

                        return <div key={item.routeName}>{linkContent}</div>;
                    })}
                </TooltipProvider>
            </nav>

            <Separator />

            {/* User section */}
            <div className={cn("p-3", collapsed && "flex justify-center")}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
                                collapsed && "justify-center px-2"
                            )}
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            {!collapsed && (
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-medium text-sidebar-foreground">{user.name}</span>
                                    <span className="text-xs text-muted-foreground">{getRoleLabel()}</span>
                                </div>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side={collapsed ? "right" : "top"} className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('profile.edit')} className="flex items-center gap-2 cursor-pointer">
                                <UserCircle className="h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center gap-2 cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                Log Out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {sidebarContent}
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
                    collapsed ? "w-[68px]" : "w-64"
                )}
            >
                {sidebarContent}
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Desktop collapse toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden lg:flex"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <ChevronLeft
                            className={cn(
                                "h-5 w-5 transition-transform",
                                collapsed && "rotate-180"
                            )}
                        />
                    </Button>

                    {/* Header content */}
                    <div className="flex flex-1 items-center justify-between">
                        {header && <div className="font-semibold">{header}</div>}
                        <div className="ml-auto flex items-center gap-2">
                            <span className="hidden text-sm text-muted-foreground sm:block">
                                {getRoleLabel()}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <FlashMessages />
                    {children}
                </main>
            </div>
        </div>
    );
}
