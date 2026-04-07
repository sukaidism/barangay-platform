import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface Props { documentRequest: { id: number; resident_id: number; document_type: string; purpose: string; status: string; fee: string | null; or_number: string | null; remarks: string | null }; residents: Array<{ id: number; first_name: string; last_name: string }>; }

const documentTypes = ['Barangay Clearance', 'Certificate of Residency', 'Business Clearance', 'Certificate of Indigency'];

export default function Edit({ documentRequest, residents }: Props) {
    const { data, setData, put, processing, errors } = useForm({ resident_id: documentRequest.resident_id.toString(), document_type: documentRequest.document_type, purpose: documentRequest.purpose, fee: documentRequest.fee || '', or_number: documentRequest.or_number || '', status: documentRequest.status, remarks: documentRequest.remarks || '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(route('documentrequest.update', documentRequest.id)); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Edit Document Request</h2>}>
            <Head title="Edit Document Request" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('documentrequest.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card><CardHeader><CardTitle>Edit Request</CardTitle></CardHeader>
                    <CardContent><form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2"><Label>Resident *</Label><Select value={data.resident_id} onChange={e => setData('resident_id', e.target.value)}><option value="">Select</option>{residents.map(r => <option key={r.id} value={r.id}>{r.first_name} {r.last_name}</option>)}</Select>{errors.resident_id && <p className="text-sm text-destructive">{errors.resident_id}</p>}</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Document Type *</Label><Select value={data.document_type} onChange={e => setData('document_type', e.target.value)}><option value="">Select</option>{documentTypes.map(t => <option key={t} value={t}>{t}</option>)}</Select>{errors.document_type && <p className="text-sm text-destructive">{errors.document_type}</p>}</div>
                            <div className="space-y-2"><Label>Fee (₱)</Label><Input type="number" step="0.01" min="0" value={data.fee} onChange={e => setData('fee', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Purpose *</Label><Textarea value={data.purpose} onChange={e => setData('purpose', e.target.value)} rows={3} />{errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Status *</Label><Select value={data.status} onChange={e => setData('status', e.target.value)}><option value="Pending">Pending</option><option value="Under Review">Under Review</option><option value="Approved">Approved</option><option value="Released">Released</option><option value="Rejected">Rejected</option></Select></div>
                            <div className="space-y-2"><Label>OR Number</Label><Input value={data.or_number} onChange={e => setData('or_number', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Remarks</Label><Textarea value={data.remarks} onChange={e => setData('remarks', e.target.value)} rows={2} /></div>
                        <Button type="submit" disabled={processing}>Update Request</Button>
                    </form></CardContent></Card>
            </div>
        </AuthenticatedLayout>
    );
}
