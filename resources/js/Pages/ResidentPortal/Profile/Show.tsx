import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

interface Props {
    resident: {
        id: number;
        first_name: string;
        middle_name: string | null;
        last_name: string;
        suffix: string | null;
        birthdate: string;
        gender: string;
        civil_status: string;
        contact_number: string | null;
        address: string;
        purok: string | null;
        status: string;
        verification_notes: string | null;
        household?: { household_number: string; address: string } | null;
    };
}

const statusLabel: Record<string, string> = {
    draft: 'Draft',
    pending_verification: 'Pending Verification',
    active: 'Active',
    rejected: 'Rejected',
    inactive: 'Inactive',
};

const statusVariant = (s: string) => {
    switch (s) {
        case 'active': return 'default' as const;
        case 'rejected': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};

export default function Show({ resident }: Props) {
    const fullName = `${resident.first_name} ${resident.middle_name || ''} ${resident.last_name} ${resident.suffix || ''}`.trim();

    const handleSubmit = () => {
        if (confirm('Submit your profile for staff verification?')) {
            router.post(route('resident-portal.profile.submit'));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">My Profile</h2>}>
            <Head title="My Profile" />
            <div className="max-w-2xl space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{fullName}</CardTitle>
                        <Badge variant={statusVariant(resident.status)}>{statusLabel[resident.status] || resident.status}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <dl className="grid grid-cols-2 gap-4">
                            <div><dt className="text-sm text-muted-foreground">Birthdate</dt><dd className="text-sm font-medium">{resident.birthdate}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Gender</dt><dd className="text-sm font-medium">{resident.gender}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Civil Status</dt><dd className="text-sm font-medium">{resident.civil_status}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Contact</dt><dd className="text-sm font-medium">{resident.contact_number || '—'}</dd></div>
                            <div className="col-span-2"><dt className="text-sm text-muted-foreground">Address</dt><dd className="text-sm font-medium">{resident.address}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Purok</dt><dd className="text-sm font-medium">{resident.purok || '—'}</dd></div>
                            <div><dt className="text-sm text-muted-foreground">Household</dt><dd className="text-sm font-medium">{resident.household ? resident.household.household_number : '—'}</dd></div>
                        </dl>

                        {resident.verification_notes && (
                            <div className="rounded-lg border p-3 bg-muted/50">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Staff Notes</p>
                                <p className="text-sm">{resident.verification_notes}</p>
                            </div>
                        )}

                        {resident.status === 'draft' && (
                            <div className="flex gap-2 pt-2">
                                <Button onClick={handleSubmit}>Submit for Verification</Button>
                                <p className="text-sm text-muted-foreground self-center">Your profile must be verified before you can access services.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
