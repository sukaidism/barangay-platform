import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import Pagination from '@/Components/Pagination';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';

interface Resident {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    gender: string;
    address: string;
    purok: string | null;
    status: string;
    created_at: string;
    household?: { household_number: string } | null;
}

interface Props {
    residents: { data: Resident[]; links: Array<{ url: string | null; label: string; active: boolean }>; total: number };
}

export default function Verification({ residents }: Props) {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [action, setAction] = useState<'approve' | 'reject' | 'revise' | null>(null);
    const [notes, setNotes] = useState('');

    const handleAction = (id: number, act: 'approve' | 'reject' | 'revise') => {
        if (act === 'approve') {
            if (!confirm('Approve this resident profile?')) return;
            router.post(route('resident.verify', id), { action: 'approve', verification_notes: '' });
        } else {
            setActiveId(id);
            setAction(act);
            setNotes('');
        }
    };

    const submitAction = () => {
        if (!activeId || !action) return;
        router.post(route('resident.verify', activeId), {
            action,
            verification_notes: notes,
        });
        setActiveId(null);
        setAction(null);
        setNotes('');
    };

    const statusLabel: Record<string, string> = {
        draft: 'Draft',
        pending_verification: 'Pending',
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Resident Verification</h2>}>
            <Head title="Verification Queue" />
            <Card>
                <CardHeader>
                    <CardTitle>Verification Queue ({residents.total})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Purok</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {residents.data.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No pending verifications.</TableCell></TableRow>
                            ) : residents.data.map(r => (
                                <>
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.first_name} {r.middle_name || ''} {r.last_name}</TableCell>
                                        <TableCell>{r.address}</TableCell>
                                        <TableCell>{r.purok || '—'}</TableCell>
                                        <TableCell><Badge variant="secondary">{statusLabel[r.status] || r.status}</Badge></TableCell>
                                        <TableCell className="text-sm">{r.created_at}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" title="Approve" onClick={() => handleAction(r.id, 'approve')}>
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Reject" onClick={() => handleAction(r.id, 'reject')}>
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Request Revision" onClick={() => handleAction(r.id, 'revise')}>
                                                    <RotateCcw className="h-4 w-4 text-amber-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {activeId === r.id && action && (
                                        <TableRow key={`${r.id}-action`}>
                                            <TableCell colSpan={6}>
                                                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                                                    <Label className="font-medium">{action === 'reject' ? 'Rejection Reason' : 'Revision Notes'} *</Label>
                                                    <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder={action === 'reject' ? 'Explain why this profile is rejected...' : 'What needs to be corrected...'} />
                                                    <div className="flex gap-2">
                                                        <Button variant={action === 'reject' ? 'destructive' : 'default'} size="sm" onClick={submitAction} disabled={!notes.trim()}>
                                                            {action === 'reject' ? 'Confirm Rejection' : 'Send for Revision'}
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => { setActiveId(null); setAction(null); }}>Cancel</Button>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination links={residents.links} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
