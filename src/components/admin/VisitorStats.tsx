import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import {
  Eye, Users, TrendingUp, Globe, Monitor, Smartphone, Tablet, Clock,
} from 'lucide-react';

type TimeRange = '7d' | '30d' | '90d';

interface PageView {
  created_at: string;
  visitor_id: string;
  referrer: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  session_duration: number | null;
  country: string | null;
}

const DEVICE_COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--accent-foreground))'];
const DEVICE_ICONS: Record<string, typeof Monitor> = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };
const RANGE_LABELS: Record<TimeRange, string> = { '7d': '7 Days', '30d': '30 Days', '90d': '90 Days' };
const RANGE_DAYS: Record<TimeRange, number> = { '7d': 7, '30d': 30, '90d': 90 };

function categorizeSource(referrer: string | null): string {
  if (!referrer) return 'Direct';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (/google|bing|yahoo|duckduckgo|baidu|yandex/.test(host)) return 'Search';
    if (/facebook|twitter|linkedin|instagram|tiktok|reddit|youtube|x\.com|threads/.test(host)) return 'Social';
    return host;
  } catch {
    return 'Other';
  }
}

const VisitorStats = () => {
  const [data, setData] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<TimeRange>('30d');

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase
        .from('page_views')
        .select('created_at, visitor_id, referrer, device_type, browser, os, session_duration')
        .order('created_at', { ascending: false })
        .limit(10000);
      setData((rows as PageView[]) || []);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    if (!data.length) return null;

    const now = new Date();
    const days = RANGE_DAYS[range];
    const cutoff = new Date(now.getTime() - days * 86400000);
    const filtered = data.filter((r) => new Date(r.created_at) >= cutoff);
    const todayStr = now.toISOString().split('T')[0];

    const totalViews = filtered.length;
    const uniqueVisitors = new Set(filtered.map((r) => r.visitor_id)).size;
    const viewsToday = filtered.filter((r) => r.created_at.startsWith(todayStr)).length;

    // Avg session duration (exclude 0 / null)
    const durations = filtered
      .map((r) => r.session_duration)
      .filter((d): d is number => d !== null && d > 0);
    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    // Traffic sources
    const sourceCounts: Record<string, number> = {};
    filtered.forEach((r) => {
      const src = categorizeSource(r.referrer);
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });
    const sources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // Device types
    const deviceCounts: Record<string, number> = {};
    filtered.forEach((r) => {
      const dt = r.device_type || 'unknown';
      deviceCounts[dt] = (deviceCounts[dt] || 0) + 1;
    });
    const devices = Object.entries(deviceCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));

    // Browsers
    const browserCounts: Record<string, number> = {};
    filtered.forEach((r) => {
      browserCounts[r.browser || 'Unknown'] = (browserCounts[r.browser || 'Unknown'] || 0) + 1;
    });
    const browsers = Object.entries(browserCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // OS
    const osCounts: Record<string, number> = {};
    filtered.forEach((r) => {
      osCounts[r.os || 'Unknown'] = (osCounts[r.os || 'Unknown'] || 0) + 1;
    });
    const operatingSystems = Object.entries(osCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Daily views
    const dailyMap: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split('T')[0]] = 0;
    }
    filtered.forEach((r) => {
      const day = r.created_at.split('T')[0];
      if (day in dailyMap) dailyMap[day]++;
    });
    const dailyViews = Object.entries(dailyMap).map(([date, views]) => ({
      date: date.slice(5),
      views,
    }));

    return { totalViews, uniqueVisitors, viewsToday, avgDuration, sources, devices, browsers, operatingSystems, dailyViews };
  }, [data, range]);

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

  const formatDuration = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const summaryCards = [
    { label: 'Total Views', value: stats.totalViews, icon: Eye },
    { label: 'Unique Visitors', value: stats.uniqueVisitors, icon: Users },
    { label: 'Views Today', value: stats.viewsToday, icon: TrendingUp },
    { label: 'Avg Session', value: formatDuration(stats.avgDuration), icon: Clock },
  ];

  return (
    <div className="mb-8 space-y-4">
      {/* Range selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(Object.keys(RANGE_LABELS) as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                range === r
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <c.icon className="h-3.5 w-3.5" />
              <span className="text-xs">{c.label}</span>
            </div>
            <p className="text-lg font-bold truncate">{c.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts row 1: Views over time */}
      {stats.dailyViews.some((d) => d.views > 0) && (
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-3">Views — Last {RANGE_LABELS[range]}</p>
          <ResponsiveContainer width="100%" height={180}>
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

      {/* Charts row 2: Devices + Traffic Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Devices */}
        {stats.devices.length > 0 && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-3">Devices</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={110} height={110}>
                <PieChart>
                  <Pie data={stats.devices} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={48} innerRadius={28}>
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
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="capitalize">{d.type}</span>
                      <span className="ml-auto text-muted-foreground text-xs">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Traffic Sources */}
        {stats.sources.length > 0 && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-3">Traffic Sources</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stats.sources.map((s) => {
                const pct = stats.totalViews > 0 ? Math.round((s.count / stats.totalViews) * 100) : 0;
                return (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="truncate flex-1">{s.name}</span>
                    <span className="text-muted-foreground text-xs shrink-0">{s.count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Charts row 3: Browser + OS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.browsers.length > 0 && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-3">Browsers</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={stats.browsers} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {stats.operatingSystems.length > 0 && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-3">Operating Systems</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={stats.operatingSystems} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VisitorStats;
