import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: PaginationLink[];
}

export default function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center gap-1 mt-4">
            {links.map((link, i) => {
                if (i === 0) {
                    return (
                        <Button key={i} variant="outline" size="sm" disabled={!link.url} asChild={!!link.url}>
                            {link.url ? (
                                <Link href={link.url}><ChevronLeft className="h-4 w-4" /></Link>
                            ) : (
                                <span><ChevronLeft className="h-4 w-4" /></span>
                            )}
                        </Button>
                    );
                }
                if (i === links.length - 1) {
                    return (
                        <Button key={i} variant="outline" size="sm" disabled={!link.url} asChild={!!link.url}>
                            {link.url ? (
                                <Link href={link.url}><ChevronRight className="h-4 w-4" /></Link>
                            ) : (
                                <span><ChevronRight className="h-4 w-4" /></span>
                            )}
                        </Button>
                    );
                }
                return (
                    <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        asChild={!!link.url}
                    >
                        {link.url ? (
                            <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
