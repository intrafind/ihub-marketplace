# HTML Dashboard Maker: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Filterable sales dashboard as a file to share

**Request**

> I need a dashboard file I can email to our two regional sales leads at Norvik Pumpen GmbH. They should be able
> to filter by region and product line. Data as of 30 Sep 2026, revenue in EUR:
>
> month, region, line, revenue: 2026-07 North Pumps 42000 · 2026-07 North Valves 18500 · 2026-07 South Pumps
> 31000 · 2026-07 South Valves 22400 · 2026-08 North Pumps 45500 · 2026-08 North Valves 17900 · 2026-08 South
> Pumps 29800 · 2026-08 South Valves 24100 · 2026-09 North Pumps 47200 · 2026-09 North Valves 19300 · 2026-09
> South Pumps 33500 · 2026-09 South Valves 23800

**How the skill handles it**

- "Is this skill the right one?": filters and a file to email, so this skill, not the built-in `dashboard` skill.
- Stage 1: readers are sales leads; questions: how much did we sell, is the trend up, which region and line
  carry it. Asks nothing: data, as-of date, audience and sharing are given.
- Stage 2: line chart for the monthly trend, bar chart (axis from zero) for the region comparison, KPI cards with
  a trend arrow for the headline figures.
- Stage 4/5 and ground rules: Chart.js pinned to 4.4.1 on cdn.jsdelivr.net, system fonts, no remote resources;
  tooltips, two filters with visible state and reset, click-to-filter on the bar chart. Totals are computed by the
  page from the embedded rows, not typed in.

**Answer**

`[From user data]` all 12 rows, embedded as given. `[Design recommendation]` KPI row on top, trend and region
charts side by side, filters above them; clicking a region bar filters to that region.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Norvik Sales Q3 2026</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
body{margin:0;padding:16px;background:#f8f9fa;color:#1f2937;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
.card{background:#fff;border-radius:8px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.12),0 1px 2px rgba(0,0,0,0.06)}
.grid{display:grid;gap:16px;margin-top:16px;grid-template-columns:1fr}
.kpi b{display:block;font-size:1.6rem}
@media(min-width:768px){.grid.k{grid-template-columns:repeat(3,1fr)}.grid.c{grid-template-columns:1fr 1fr}}
@media(min-width:1200px){body{max-width:1160px;margin:0 auto}}
@media(prefers-color-scheme:dark){body{background:#111827;color:#e5e7eb}.card{background:#1f2937}}
</style>
</head>
<body>
<h1>Norvik Sales, Jul–Sep 2026</h1>
<p>Data as of 30 Sep 2026 · Showing: <span id="state"></span></p>
<label>Region <select id="fRegion"><option>All</option><option>North</option><option>South</option></select></label>
<label>Line <select id="fLine"><option>All</option><option>Pumps</option><option>Valves</option></select></label>
<button id="reset">Reset filters</button>
<div class="grid k">
  <div class="card kpi">Revenue, Jul–Sep<b id="kTotal"></b></div>
  <div class="card kpi">Revenue, Sep<b id="kSep"></b><span id="kTrend"></span></div>
  <div class="card kpi">Pumps share<b id="kShare"></b></div>
</div>
<div class="grid c">
  <div class="card"><canvas id="trend" aria-label="Revenue by month"></canvas></div>
  <div class="card"><canvas id="regions" aria-label="Revenue by region"></canvas></div>
</div>
<script>
const rawData=[["2026-07","North","Pumps",42000],["2026-07","North","Valves",18500],["2026-07","South","Pumps",31000],["2026-07","South","Valves",22400],["2026-08","North","Pumps",45500],["2026-08","North","Valves",17900],["2026-08","South","Pumps",29800],["2026-08","South","Valves",24100],["2026-09","North","Pumps",47200],["2026-09","North","Valves",19300],["2026-09","South","Pumps",33500],["2026-09","South","Valves",23800]].map(([m,r,l,v])=>({m,r,l,v}));
const eur=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'EUR'}).format(n);
const sum=(rows,f)=>rows.filter(f).reduce((a,x)=>a+x.v,0);
const months=["2026-07","2026-08","2026-09"],regions=["North","South"];
const axis=t=>({beginAtZero:true,title:{display:true,text:t}});
const tip={callbacks:{label:c=>eur(c.parsed.y)}};
const trend=new Chart(document.getElementById('trend'),{type:'line',data:{labels:months,datasets:[{label:'Revenue (EUR)',borderColor:'#2563eb',data:[]}]},options:{plugins:{tooltip:tip},scales:{x:{title:{display:true,text:'Month'}},y:axis('EUR')}}});
const bars=new Chart(document.getElementById('regions'),{type:'bar',data:{labels:regions,datasets:[{label:'Revenue (EUR)',backgroundColor:'#16a34a',data:[]}]},options:{plugins:{tooltip:tip},scales:{x:{title:{display:true,text:'Region'}},y:axis('EUR')},onClick:(e,els)=>{if(els.length){fRegion.value=regions[els[0].index];applyFilters();}}}});
function applyFilters(){
  const r=fRegion.value,l=fLine.value;
  const rows=rawData.filter(x=>(r==='All'||x.r===r)&&(l==='All'||x.l===l));
  const total=sum(rows,()=>true),sep=sum(rows,x=>x.m==='2026-09'),aug=sum(rows,x=>x.m==='2026-08');
  kTotal.textContent=eur(total);kSep.textContent=eur(sep);
  kTrend.textContent=sep>aug?'↑ vs Aug':sep<aug?'↓ vs Aug':'→ vs Aug';
  kShare.textContent=total?(100*sum(rows,x=>x.l==='Pumps')/total).toFixed(1)+'%':'No data';
  trend.data.datasets[0].data=months.map(m=>sum(rows,x=>x.m===m));trend.update();
  bars.data.datasets[0].data=regions.map(g=>sum(rows,x=>x.r===g));bars.update();
  state.textContent=`Region: ${r} · Line: ${l}`;
}
fRegion.onchange=fLine.onchange=applyFilters;
reset.onclick=()=>{fRegion.value='All';fLine.value='All';applyFilters();};
applyFilters();
</script>
</body>
</html>
```

## Example 2: A read-only KPI page goes to the built-in skill

**Request**

> Can you make a dashboard of our support figures for the management meeting? Tickets opened 1,240, closed 1,198,
> median first response 3.2 h, CSAT 4.4 of 5, tickets per month for the last six months attached. Just something
> they can look at.

**How the skill handles it**

- "Is this skill the right one?": a page someone only reads, with KPI tiles and a monthly trend; no filters,
  custom design or file requested. "Unsure? … take the built-in skill" settles it.
- So it activates iHub's built-in `dashboard` skill and writes no HTML.

**Answer**

This is a read-only page of figures, so I'll build it with iHub's built-in dashboard instead of a custom HTML
file: KPI tiles for the four figures, a monthly trend, a table view of each chart, and the source of every number.

If you later want something the built-in dashboard can't do, such as filters by team or channel, clicking a month
to drill into its tickets, or a standalone HTML file to send outside iHub, tell me and I'll build a custom
interactive dashboard instead.
