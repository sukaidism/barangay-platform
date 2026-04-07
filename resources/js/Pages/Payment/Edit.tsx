import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface Props { payment: { id: number; resident_id: number; amount: string; or_number: string | null; status: string; remarks: string | null; paid_at: string | null }; residents: Array<{ id: number; first_name: string; last_name: string }>; }

export default function Edit({ payment, residents }: Props) {
    const { data, setData, put, processing, errors } = useForm({ resident_id: payment.resident_id.toString(), amount: payment.amount, or_number: payment.or_number || '', status: payment.status, remarks: payment.remarks || '', paid_at: payment.paid_at || '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(route('payment.update', payment.id)); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Edit Payment</h2>}>
            <Head title="Edit Payment" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('payment.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card><CardHeader><CardTitle>Edit Payment</CardTitle></CardHeader>
                    <CardContent><form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2"><Label>Resident *</Label><Select value={data.resident_id} onChange={e => setData('resident_id', e.target.value)}><option value="">Select</option>{residents.map(r => <option key={r.id} value={r.id}>{r.first_name} {r.last_name}</option>)}</Select>{errors.resident_id && <p className="text-sm text-destructive">{errors.resident_id}</p>}</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Amount (₱) *</Label><Input type="number" step="0.01" min="0" value={data.amount} onChange={e => setData('amount', e.target.value)} />{errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}</div>
                            <div className="space-y-2"><Label>OR Number</Label><Input value={data.or_number} onChange={e => setData('or_number', e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Status *</Label><Select value={data.status} onChange={e => setData('status', e.target.value)}><option value="Pending">Pending</option><option value="Paid">Paid</option><option value="Cancelled">Cancelled</option></Select></div>
                            <div className="space-y-2"><Label>Paid At</Label><Input type="datetime-local" value={data.paid_at} onChange={e => setData('paid_at', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Remarks</Label><Textarea value={data.remarks} onChange={e => setData('remarks', e.target.value)} rows={2} /></div>
                        <Button type="submit" disabled={processing}>Update Payment</Button>
                    </form></CardContent></Card>
            </div>
        </AuthenticatedLayout>
    );
}
