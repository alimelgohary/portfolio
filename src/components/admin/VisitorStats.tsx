import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Users, TrendingUp, Globe } from 'lucide-react';

interface DailyView {
  date: string;
  views: number;
}

interface Stats {
  totalViews: number;
  uniqueVisitors: number;
  viewsToday: number;
  topReferrer: string;
  dailyViews: DailyView[];
}

const VisitorStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('page_views')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Total views
    const totalViews = data.length;

    // Unique visitors
    const uniqueVisitors = new Set(data.map((r) => r.visitor_id)).size;

    // Views today
    const viewsToday = data.filter((r) => r.created_at.startsWith(todayStr)).length;

    // Top referrer
    const refCounts: Record<string, number> = {};
    data.forEach((r) => {
      if (r.referrer) {
        try {
          const host = new URL(r.referrer).hostname;
          refCounts[host] = (refCounts[host] || 0) + 1;
        } catch {
          refCounts[r.referrer] = (refCounts[r.referrer] || 0) + 1;
        }
      }
    });
    const topReferrer = Object.entries(refCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Direct';

    // Daily views for last 30 days
    const dailyMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split('T')[0]] = 0;
    }
    data.forEach((r) => {
      const day = r.created_at.split('T')[0];
      if (day in dailyMap) dailyMap[day]++;
    });
    const dailyViews = Object.entries(dailyMap).map(([date, views]) => ({
      date: date.slice(5), // MM-DD
      views,
    }));

    setStats({ totalViews, uniqueVisitors, viewsToday, topReferrer, dailyViews });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-20 mb-2" />
            <div className="h-6 bg-muted rounded w-12" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Views', value: stats.totalViews, icon: Eye },
    { label: 'Unique Visitors', value: stats.uniqueVisitors, icon: Users },
    { label: 'Views Today', value: stats.viewsToday, icon: TrendingUp },
    { label: 'Top Referrer', value: stats.topReferrer, icon: Globe },
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <c.icon className="h-3.5 w-3.5" />
              <span className="text-xs">{c.label}</span>
            </div>
            <p className="text-lg font-bold truncate">{c.value}</p>
          </Card>
        ))}
      </div>

      {stats.dailyViews.some((d) => d.views > 0) && (
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-3">Views — Last 30 Days</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={stats.dailyViews}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" stroke="hsl(var(--muted-foreground))" />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default VisitorStats;
