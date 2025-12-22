'use client';

import { Layout } from '@/components/layout';

export default function TypographyDemo() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-display-lg mb-4">CityBuild Typography System</h1>
          <p className="text-xl text-muted-foreground">
            Showcasing our distinctive font choices: Archivo, JetBrains Mono, and Bebas Neue
          </p>
        </div>

        {/* Archivo - Primary Font */}
        <section className="mb-16 p-8 bg-card border-2 border-border rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-primary">Archivo - Primary Font</h2>
          <p className="text-muted-foreground mb-6">
            A geometric sans-serif with industrial character, perfect for headings and UI elements
          </p>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-5xl font-bold mb-2">Heading 1 - Bold</h1>
              <p className="text-sm text-muted-foreground">font-size: 2.5rem, font-weight: 700</p>
            </div>
            
            <div>
              <h2 className="text-4xl font-semibold mb-2">Heading 2 - Semibold</h2>
              <p className="text-sm text-muted-foreground">font-size: 2rem, font-weight: 600</p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-2">Heading 3 - Semibold</h3>
              <p className="text-sm text-muted-foreground">font-size: 1.5rem, font-weight: 600</p>
            </div>
            
            <div>
              <p className="text-lg mb-2">Body text - Regular</p>
              <p className="text-sm text-muted-foreground">font-size: 1.125rem, font-weight: 400</p>
            </div>
            
            <div>
              <p className="text-base font-medium mb-2">Medium weight text for emphasis</p>
              <p className="text-sm text-muted-foreground">font-size: 1rem, font-weight: 500</p>
            </div>
          </div>
        </section>

        {/* JetBrains Mono - Data Font */}
        <section className="mb-16 p-8 bg-card border-2 border-border rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-primary">JetBrains Mono - Data & Technical</h2>
          <p className="text-muted-foreground mb-6">
            Monospace font for data, numbers, and technical information (measurements, costs, quantities)
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Cost Display:</p>
              <p className="cost-display text-primary">$1,234,567.89</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Number Display:</p>
              <p className="number-display text-2xl">42,500 sq ft</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Technical Data:</p>
              <p className="text-technical">
                Material ID: MAT-2024-001<br />
                Quantity: 1,250 units<br />
                Delivery: 2024-12-25<br />
                Status: IN_TRANSIT
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Tabular Numbers:</p>
              <div className="text-data space-y-1">
                <div className="flex justify-between max-w-md">
                  <span>Lumber 2x4x8:</span>
                  <span>$8.99</span>
                </div>
                <div className="flex justify-between max-w-md">
                  <span>Concrete Mix:</span>
                  <span>$12.50</span>
                </div>
                <div className="flex justify-between max-w-md">
                  <span>Rebar #4:</span>
                  <span>$125.00</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bebas Neue - Display Font */}
        <section className="mb-16 p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-primary">Bebas Neue - Display Font</h2>
          <p className="text-muted-foreground mb-6">
            Condensed display font for hero sections and emphasis
          </p>
          
          <div className="space-y-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Large Display:</p>
              <p className="text-display-lg text-primary">Build Better, Build Faster</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Medium Display:</p>
              <p className="text-display-md text-primary">Construction Marketplace</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Small Display:</p>
              <p className="text-display-sm text-primary">Real-Time Bidding</p>
            </div>
          </div>
        </section>

        {/* Combined Example */}
        <section className="p-8 bg-card border-2 border-border rounded-2xl">
          <h2 className="text-display-md text-primary mb-4">Project Overview</h2>
          <h3 className="text-2xl font-semibold mb-6">Downtown Office Complex</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-base mb-4">
                This project demonstrates how our typography system works together to create a cohesive, 
                professional interface that's uniquely suited to the construction industry.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                  <span className="font-medium">Total Cost:</span>
                  <span className="cost-display text-primary">$2,450,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                  <span className="font-medium">Square Footage:</span>
                  <span className="number-display text-primary">85,000 sq ft</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                  <span className="font-medium">Timeline:</span>
                  <span className="text-data">18 months</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3">Material Breakdown</h4>
              <div className="text-technical space-y-2 bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Concrete (cu yd):</span>
                  <span>2,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Steel (tons):</span>
                  <span>450</span>
                </div>
                <div className="flex justify-between">
                  <span>Lumber (bd ft):</span>
                  <span>125,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Drywall (sheets):</span>
                  <span>8,500</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Font Stack Info */}
        <section className="mt-16 p-6 bg-muted/30 border border-border rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Font Stack Implementation</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold mb-2">Primary (Archivo):</p>
              <code className="text-xs bg-background p-2 rounded block">
                --font-primary: 'Archivo', sans-serif
              </code>
            </div>
            <div>
              <p className="font-semibold mb-2">Mono (JetBrains Mono):</p>
              <code className="text-xs bg-background p-2 rounded block">
                --font-mono: 'JetBrains Mono', monospace
              </code>
            </div>
            <div>
              <p className="font-semibold mb-2">Display (Bebas Neue):</p>
              <code className="text-xs bg-background p-2 rounded block">
                --font-display: 'Bebas Neue', sans-serif
              </code>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
