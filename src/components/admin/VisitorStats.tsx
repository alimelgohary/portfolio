import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, Users, TrendingUp, Globe, Monitor, Smartphone, Tablet } from 'lucide-react';

interface DailyView {
  date: string;
  views: number;
}

interface ReferrerEntry {
  host: string;
  count: number;
}

interface DeviceEntry {
  type: string;
  count: number;
}

interface Stats {
  totalViews: number;
  uniqueVisitors: number;
  viewsToday: number;
  referrers: ReferrerEntry[];
  dailyViews: DailyView[];
  devices: DeviceEntry[];
}

const DEVICE_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--accent-foreground))'];
const DEVICE_ICONS: Record<string, typeof Monitor> = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };

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

    const totalViews = data.length;
    const uniqueVisitors = new Set(data.map((r) => r.visitor_id)).size;
    const viewsToday = data.filter((r) => r.created_at.startsWith(todayStr)).length;

    // All referrers
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
    const referrers = Object.entries(refCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([host, count]) => ({ host, count }));

    // Device types
    const deviceCounts: Record<string, number> = {};
    data.forEach((r) => {
      const dt = (r as any).device_type || 'unknown';
      deviceCounts[dt] = (deviceCounts[dt] || 0) + 1;
    });
    const devices = Object.entries(deviceCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));

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
      date: date.slice(5),
      views,
    }));

    setStats({ totalViews, uniqueVisitors, viewsToday, referrers, dailyViews, devices });
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
    { label: 'Referrers', value: stats.referrers.length, icon: Globe },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Summary cards */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily chart */}
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

        {/* Device breakdown */}
        {stats.devices.length > 0 && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-3">Devices</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={stats.devices} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={50} innerRadius={30}>
                    {stats.devices.map((_, i) => (
                      <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {stats.devices.map((d, i) => {
                  const Icon = DEVICE_ICONS[d.type] || Monitor;
                  const pct = stats.totalViews > 0 ? Math.round((d.count / stats.totalViews) * 100) : 0;
                  return (
                    <div key={d.type} className="flex items-center gap-2 text-sm">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="capitalize">{d.type}</span>
                      <span className="ml-auto text-muted-foreground text-xs">{d.count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* All referrers */}
      {stats.referrers.length > 0 && (
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-3">Referrers</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {stats.referrers.map((r) => (
              <div key={r.host} className="flex items-center justify-between text-sm">
                <span className="truncate mr-4">{r.host}</span>
                <span className="text-muted-foreground text-xs shrink-0">{r.count} visits</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default VisitorStats;
