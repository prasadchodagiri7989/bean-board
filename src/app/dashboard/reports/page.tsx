import ReportsClient from '@/components/reports/reports-client';

export default function ReportsPage() {
    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                    Insights into your café's performance.
                </p>
            </header>
            <ReportsClient />
        </div>
    );
}
