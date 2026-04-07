import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface Props {
    residents: Array<{ id: number; first_name: string; last_name: string }>;
}

export default function Create({ residents }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        household_number: '',
        head_id: '',
        address: '',
        purok: '',
    });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post(route('household.store')); };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Add Household</h2>}>
            <Head title="Add Household" />
            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild><Link href={route('household.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
                <Card>
                    <CardHeader><CardTitle>New Household</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="household_number">Household Number *</Label>
                                    <Input id="household_number" value={data.household_number} onChange={e => setData('household_number', e.target.value)} />
                                    {errors.household_number && <p className="text-sm text-destructive">{errors.household_number}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="head_id">Household Head</Label>
                                    <Select id="head_id" value={data.head_id} onChange={e => setData('head_id', e.target.value)}>
                                        <option value="">Select</option>
                                        {residents.map(r => <option key={r.id} value={r.id}>{r.first_name} {r.last_name}</option>)}
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address *</Label>
                                    <Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} />
                                    {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="purok">Purok</Label>
                                    <Input id="purok" value={data.purok} onChange={e => setData('purok', e.target.value)} />
                                </div>
                            </div>
                            <Button type="submit" disabled={processing}>Save Household</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
