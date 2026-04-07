import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Pencil, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';

interface AuditLog {
    id: number;
    action: string;
    description: string | null;
    created_at: string;
    user?: { name: string } | null;
}

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
        verified_at: string | null;
        verifier?: { name: string } | null;
        household?: { id: number; household_number: string; address: string } | null;
    };
    auditLogs?: AuditLog[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    draft: 'outline',
    pending_verification: 'secondary',
    rejected: 'destructive',
    inactive: 'secondary',
};

const statusLabel: Record<string, string> = {
    active: 'Active',
    draft: 'Draft',
    pending_verification: 'Pending Verification',
    rejected: 'Rejected',
    inactive: 'Inactive',
};

export default function Show({ resident, auditLogs = [] }: Props) {
    const fullName = `${resident.first_name} ${resident.middle_name || ''} ${resident.last_name} ${resident.suffix || ''}`.trim();
    const [actionType, setActionType] = useState<'reject' | 'revise' | null>(null);
    const [notes, setNotes] = useState('');

    const handleApprove = () => {
        if (!confirm('Approve this resident profile?')) return;
        router.post(route('resident.verify', resident.id), { action: 'approve', verification_notes: '' });
    };

    const submitAction = () => {
        if (!actionType) return;
        router.post(route('resident.verify', resident.id), { action: actionType, verification_notes: notes });
        setActionType(null);
        setNotes('');
    };

    const fields = [
        { label: 'Full Name', value: fullName },
        { label: 'Birthdate', value: resident.birthdate },
        { label: 'Gender', value: resident.gender },
        { label: 'Civil Status', value: resident.civil_status },
        { label: 'Contact', value: resident.contact_number || '—' },
        { label: 'Address', value: resident.address },
        { label: 'Purok', value: resident.purok || '—' },
        { label: 'Household', value: resident.household ? `${resident.household.household_number}` : '—' },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Resident Details</h2>}>
            <Head title={`Resident - ${fullName}`} />

            <div className="max-w-3xl space-y-4">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={route('resident.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('resident.edit', resident.id)}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{fullName}</CardTitle>
                        <Badge variant={statusVariant[resident.status] || 'secondary'}>
                            {statusLabel[resident.status] || resident.status}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <dl className="grid grid-cols-2 gap-4">
                            {fields.map(f => (
                                <div key={f.label}>
                                    <dt className="text-sm text-muted-foreground">{f.label}</dt>
                                    <dd className="text-sm font-medium">{f.value}</dd>
                                </div>
                            ))}
                        </dl>

                        {/* Verification Info */}
                        {(resident.verified_at || resident.verification_notes) && (
                            <div className="rounded-lg border p-4 space-y-2">
                                <h3 className="text-sm font-semibold">Verification Details</h3>
                                {resident.verified_at && (
                                    <p className="text-sm text-muted-foreground">
                                        Verified on {resident.verified_at} by {resident.verifier?.name || 'System'}
                                    </p>
                                )}
                                {resident.verification_notes && (
                                    <p className="text-sm"><span className="font-medium">Notes:</span> {resident.verification_notes}</p>
                                )}
                            </div>
                        )}

                        {/* Verification Actions */}
                        {resident.status === 'pending_verification' && (
                            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                                <h3 className="text-sm font-semibold">Verification Actions</h3>
                                {!actionType ? (
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={handleApprove}>
                                            <CheckCircle className="mr-2 h-4 w-4" />Approve
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => setActionType('reject')}>
                                            <XCircle className="mr-2 h-4 w-4" />Reject
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setActionType('revise')}>
                                            <RotateCcw className="mr-2 h-4 w-4" />Request Revision
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Label>{actionType === 'reject' ? 'Rejection Reason' : 'Revision Notes'} *</Label>
                                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
                                        <div className="flex gap-2">
                                            <Button variant={actionType === 'reject' ? 'destructive' : 'default'} size="sm" onClick={submitAction} disabled={!notes.trim()}>
                                                {actionType === 'reject' ? 'Confirm Rejection' : 'Send for Revision'}
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => { setActionType(null); setNotes(''); }}>Cancel</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Audit Log */}
                {auditLogs.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Activity Log</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                                {auditLogs.map(log => (
                                    <div key={log.id} className="flex gap-4 pl-6">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">{log.action}</p>
                                            {log.description && <p className="text-sm text-muted-foreground">{log.description}</p>}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {log.user?.name || 'System'} &middot; {log.created_at}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
