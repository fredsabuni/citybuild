'use client';

import { Layout } from '@/components/layout';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function ColorDemo() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-display-lg mb-4">CityBuild Color System</h1>
            <p className="text-xl text-muted-foreground">
              Construction Red (#981C1E) & Golden Yellow (#F7AD3F) with standard status colors
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Primary Colors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Primary Colors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="h-32 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#981C1E' }}>
                Primary
                <br />
                #981C1E
              </div>
              <p className="text-sm text-muted-foreground">Deep construction red - dominant color</p>
            </div>
            
            <div className="space-y-3">
              <div className="h-32 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#B8292C' }}>
                Primary Light
                <br />
                #B8292C
              </div>
              <p className="text-sm text-muted-foreground">Lighter red for hover states</p>
            </div>
            
            <div className="space-y-3">
              <div className="h-32 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#7A1618' }}>
                Primary Dark
                <br />
                #7A1618
              </div>
              <p className="text-sm text-muted-foreground">Darker red for pressed states</p>
            </div>
          </div>
        </section>

        {/* Accent Colors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Accent Colors</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-32 rounded-xl flex items-center justify-center text-foreground font-bold" style={{ background: '#F7AD3F' }}>
                Accent
                <br />
                #F7AD3F
              </div>
              <p className="text-sm text-muted-foreground">Golden yellow - sharp accent color</p>
            </div>
            
            <div className="space-y-3">
              <div className="h-32 rounded-xl flex items-center justify-center text-foreground font-bold" style={{ background: '#FFD166' }}>
                Accent Secondary
                <br />
                #FFD166
              </div>
              <p className="text-sm text-muted-foreground">Warm yellow for highlights</p>
            </div>
          </div>
        </section>

        {/* Status Colors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Status Colors (Standard)</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="h-32 rounded-xl flex items-center justify-center text-white font-bold bg-[#059669]">
                Success
                <br />
                #059669
              </div>
              <p className="text-sm text-muted-foreground">Emerald green for success states</p>
            </div>
            
            <div className="space-y-3">
              <div className="h-32 rounded-xl flex items-center justify-center text-white font-bold bg-[#F59E0B]">
                Warning
                <br />
                #F59E0B
              </div>
              <p className="text-sm text-muted-foreground">Amber for warning states</p>
            </div>
            
            <div className="space-y-3">
              <div className="h-32 rounded-xl flex items-center justify-center text-white font-bold bg-[#DC2626]">
                Error
                <br />
                #DC2626
              </div>
              <p className="text-sm text-muted-foreground">Red for error states</p>
            </div>
            
            <div className="space-y-3">
              <div className="h-32 rounded-xl flex items-center justify-center text-white font-bold bg-[#3B82F6]">
                Info
                <br />
                #3B82F6
              </div>
              <p className="text-sm text-muted-foreground">Blue for informational states</p>
            </div>
          </div>
        </section>

        {/* Theme Comparison */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Light vs Dark Theme</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-card border-2 border-border rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Light Theme - "Blueprint"</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded" style={{ background: '#981C1E' }}></div>
                  <span>Primary: Construction Red</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded" style={{ background: '#F7AD3F' }}></div>
                  <span>Accent: Golden Yellow</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-border" style={{ background: '#F8F9FA' }}></div>
                  <span>Surface: Off-white</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-border" style={{ background: '#FFFFFF' }}></div>
                  <span>Elevated: Pure white</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-card border-2 border-border rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Dark Theme - "Night Site"</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded" style={{ background: '#F7AD3F' }}></div>
                  <span>Primary: Golden Yellow (swapped)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded" style={{ background: '#981C1E' }}></div>
                  <span>Accent: Construction Red (swapped)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-border" style={{ background: '#0F172A' }}></div>
                  <span>Surface: Deep slate</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-border" style={{ background: '#1E293B' }}></div>
                  <span>Elevated: Lighter slate</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Component Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Component Examples</h2>
          
          {/* Buttons */}
          <div className="mb-8 p-6 bg-card border-2 border-border rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">Primary Button</button>
              <button className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent-secondary transition-colors">
                Accent Button
              </button>
              <button className="px-6 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                Outline Button
              </button>
            </div>
          </div>

          {/* Status Badges */}
          <div className="mb-8 p-6 bg-card border-2 border-border rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Status Badges</h3>
            <div className="flex flex-wrap gap-4">
              <span className="badge-success">Success</span>
              <span className="badge-warning">Warning</span>
              <span className="badge-error">Error</span>
              <span className="badge-info">Info</span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border-2 border-primary rounded-2xl">
              <h4 className="text-lg font-semibold mb-2 text-primary">Primary Card</h4>
              <p className="text-sm text-muted-foreground">Card with primary border accent</p>
            </div>
            
            <div className="p-6 bg-accent text-accent-foreground rounded-2xl">
              <h4 className="text-lg font-semibold mb-2">Accent Card</h4>
              <p className="text-sm opacity-80">Card with accent background</p>
            </div>
            
            <div className="p-6 bg-card border-2 border-border rounded-2xl hover:border-primary transition-colors">
              <h4 className="text-lg font-semibold mb-2">Hover Card</h4>
              <p className="text-sm text-muted-foreground">Hover to see border change</p>
            </div>
          </div>
        </section>

        {/* Real-world Example */}
        <section className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary rounded-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-display-md text-primary mb-2">Project Dashboard</h2>
              <p className="text-muted-foreground">Downtown Office Complex</p>
            </div>
            <span className="badge-success">Active</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-card rounded-xl border-2 border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
              <p className="cost-display text-primary">$2,450,000</p>
            </div>
            <div className="p-4 bg-card rounded-xl border-2 border-border">
              <p className="text-sm text-muted-foreground mb-1">Completion</p>
              <p className="number-display text-2xl">67%</p>
            </div>
            <div className="p-4 bg-card rounded-xl border-2 border-border">
              <p className="text-sm text-muted-foreground mb-1">Timeline</p>
              <p className="text-data text-xl">18 months</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="btn-primary">View Details</button>
            <button className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent-secondary transition-colors">
              Generate Report
            </button>
          </div>
        </section>

        {/* CSS Variables Reference */}
        <section className="mt-16 p-6 bg-muted/30 border border-border rounded-xl">
          <h3 className="text-xl font-semibold mb-4">CSS Variables Reference</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm font-mono">
            <div>
              <p className="font-semibold mb-2 font-primary">Light Theme:</p>
              <code className="text-xs bg-background p-3 rounded block space-y-1">
                --primary: #981C1E<br />
                --accent: #F7AD3F<br />
                --surface: #F8F9FA<br />
                --background: #FFFFFF
              </code>
            </div>
            <div>
              <p className="font-semibold mb-2 font-primary">Dark Theme:</p>
              <code className="text-xs bg-background p-3 rounded block space-y-1">
                --primary: #F7AD3F<br />
                --accent: #981C1E<br />
                --surface: #0F172A<br />
                --background: #0F172A
              </code>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
