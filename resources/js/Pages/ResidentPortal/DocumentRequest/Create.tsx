import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface Props {
    documentTypes: string[];
}

export default function Create({ documentTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({ document_type: '', purpose: '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post(route('resident-portal.document-requests.store')); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Request Document</h2>}>
            <Head title="Request Document" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('resident-portal.document-requests.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Document Request Form</CardTitle>
                        <CardDescription>Submit a request for a barangay document. Staff will review and process your request.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2"><Label>Document Type *</Label><Select value={data.document_type} onChange={e => setData('document_type', e.target.value)}><option value="">Select Document Type</option>{documentTypes.map(t => <option key={t} value={t}>{t}</option>)}</Select>{errors.document_type && <p className="text-sm text-destructive">{errors.document_type}</p>}</div>
                            <div className="space-y-2"><Label>Purpose *</Label><Textarea value={data.purpose} onChange={e => setData('purpose', e.target.value)} rows={4} placeholder="Explain why you need this document" />{errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}</div>
                            <Button type="submit" disabled={processing}>Submit Request</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
