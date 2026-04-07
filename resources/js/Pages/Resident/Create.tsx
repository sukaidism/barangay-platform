import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface Household {
    id: number;
    household_number: string;
    address: string;
}

interface Props {
    households: Household[];
}

export default function Create({ households }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        birthdate: '',
        gender: '',
        civil_status: '',
        contact_number: '',
        address: '',
        purok: '',
        household_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('resident.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Add Resident</h2>}>
            <Head title="Add Resident" />

            <div className="max-w-2xl">
                <Button variant="ghost" size="sm" className="mb-4" asChild>
                    <Link href={route('resident.index')}><ArrowLeft className="mr-2 h-4 w-4" />Back to List</Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>New Resident</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name *</Label>
                                    <Input id="first_name" value={data.first_name} onChange={e => setData('first_name', e.target.value)} />
                                    {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="middle_name">Middle Name</Label>
                                    <Input id="middle_name" value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name *</Label>
                                    <Input id="last_name" value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
                                    {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="suffix">Suffix</Label>
                                    <Input id="suffix" value={data.suffix} onChange={e => setData('suffix', e.target.value)} placeholder="Jr., Sr., III" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="birthdate">Birthdate *</Label>
                                    <Input id="birthdate" type="date" value={data.birthdate} onChange={e => setData('birthdate', e.target.value)} />
                                    {errors.birthdate && <p className="text-sm text-destructive">{errors.birthdate}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender *</Label>
                                    <Select id="gender" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Select>
                                    {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="civil_status">Civil Status *</Label>
                                    <Select id="civil_status" value={data.civil_status} onChange={e => setData('civil_status', e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Divorced">Divorced</option>
                                    </Select>
                                    {errors.civil_status && <p className="text-sm text-destructive">{errors.civil_status}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_number">Contact Number</Label>
                                    <Input id="contact_number" value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} />
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

                            <div className="space-y-2">
                                <Label htmlFor="household_id">Household</Label>
                                <Select id="household_id" value={data.household_id} onChange={e => setData('household_id', e.target.value)}>
                                    <option value="">None</option>
                                    {households.map(h => (
                                        <option key={h.id} value={h.id}>{h.household_number} — {h.address}</option>
                                    ))}
                                </Select>
                            </div>

                            <Button type="submit" disabled={processing}>Save Resident</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
