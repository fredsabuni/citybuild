'use client';

import { useTheme } from '@/lib/context';
import { CityBuildLogo } from '@/components/ui';
import {ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('owner');

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <CityBuildLogo size="md" showText={true} />

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('how-it-works')} className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('stakeholders')} className="text-muted-foreground hover:text-foreground transition-colors">
              Users
            </button>
            <button onClick={() => scrollToSection('partners')} className="text-muted-foreground hover:text-foreground transition-colors">
              Partners
            </button>
            <button onClick={() => scrollToSection('team')} className="text-muted-foreground hover:text-foreground transition-colors">
              Leadership
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <SunIcon className="w-5 h-5" />
              )}
            </button> */}
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 dark:from-primary/10 dark:via-accent/10 dark:to-primary/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display-lg mb-8 text-primary">
              Construction Procurement, <span style={{ color: 'var(--accent)' }}>Reimagined</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Turn materials procurement from a relationship-driven black box into a real-time AI-powered marketplace where transparency, verification, and competitive bidding are built in from day one.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => scrollToSection('stakeholders')}
                className="btn-primary text-lg px-10 py-4"
              >
                Start Building Today
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-10 py-4 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg"
              >
                See How It Works
              </button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-card border-2 border-primary/20 hover:border-primary transition-colors">
                <div className="text-display-sm text-primary mb-2">24/7</div>
                <div className="text-sm font-medium text-muted-foreground">AI-Powered Bidding</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border-2 border-success/20 hover:border-success transition-colors">
                <div className="text-display-sm text-success mb-2">100%</div>
                <div className="text-sm font-medium text-muted-foreground">Funding Verified</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border-2 border-accent/20 hover:border-accent transition-colors">
                <div className="text-display-sm text-accent-foreground mb-2">Real-time</div>
                <div className="text-sm font-medium text-muted-foreground">Price Discovery</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border-2 border-primary/20 hover:border-primary transition-colors">
                <div className="text-display-sm text-primary mb-2">Zero</div>
                <div className="text-sm font-medium text-muted-foreground">Back-office Friction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDownIcon className="w-6 h-6 text-primary" />
        </div>
      </section>
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-display-md text-primary mb-6">How CityBuild℠ <span style={{ color: 'var(--accent)' }}>Works</span></h2>
            <p className="text-xl text-muted-foreground">
              Our AI reads your project plans the moment they're filed for permits—instantly generating a complete, trade-specific material list and routing it to a verified supplier network in real time.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border-2 border-primary/20 hover:border-primary rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">AI Plan Analysis</h3>
              <p className="text-muted-foreground">
                Our GPU-native infrastructure processes project plans instantly, generating complete material lists for every trade automatically.
              </p>
            </div>

            <div className="bg-card border-2 border-accent/20 hover:border-accent rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-accent-foreground">Real-time Bidding</h3>
              <p className="text-muted-foreground">
                Thousands of supplier bids processed around the clock, 24/7, with zero back-office bottlenecks. No human could match this speed or scale.
              </p>
            </div>

            <div className="bg-card border-2 border-success/20 hover:border-success rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-success">Verified & Secured</h3>
              <p className="text-muted-foreground">
                Funding verification and locked pricing upfront. Integrated payment systems with flexible terms mean predictable cash flow for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Sections */}
      <section id="stakeholders" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Built for Every Stakeholder</h2>
            <p className="text-xl text-muted-foreground">
              CityBuild℠ transforms how every party in construction procurement works—making it easier, cheaper, faster, and fully transparent.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'bank', label: 'Banks', icon: '🏦' },
              { id: 'owner', label: 'Owners', icon: '👤' },
              { id: 'contractor', label: 'General Contractors', icon: '👷' },
              { id: 'subcontractor', label: 'Subcontractors', icon: '🔧' },
              { id: 'supplier', label: 'Distributors', icon: '📦' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card border-2 border-border hover:border-primary hover:shadow-md'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'bank' && (
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
                <h3 className="text-3xl font-bold mb-6 text-center">Banks</h3>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  CityBuild℠ transforms construction lending by providing verified project data, real-time tracking, and transparent marketplace dynamics that reduce risk and streamline loan processing.
                </p>
                
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => router.push('/dashboard?role=bank')}
                    className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">What You Get:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Complete project verification and funding requirements upfront</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Real-time material costs and project progress tracking</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Transparent marketplace reduces credit risk and uncertainty</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Integrated payment systems with flexible terms and securitized credit</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Benefits:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Streamlined loan processing and faster approvals</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Lower default rates through verified funding and transparency</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Real-time project data for better risk assessment</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Access to verified construction marketplace data</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'owner' && (
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
                <h3 className="text-3xl font-bold mb-6 text-center">Owners</h3>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  CityBuild℠ turns materials procurement from a relationship-driven black box into a real-time AI-powered marketplace where transparency, verification, and competitive bidding are built in from day one.
                </p>
                
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => router.push('/dashboard?role=owner')}
                    className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">How It Works:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>AI reads project plans instantly upon permit filing</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Complete trade-specific material lists generated automatically</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>GPU-native infrastructure processes thousands of bids 24/7</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Funding verification and price locking before any dollar moves</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Results:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Materially more predictable projects</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Cost certainty and schedule predictability</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Complete audit trail of every transaction</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Unprecedented market data about construction costs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contractor' && (
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
                <h3 className="text-3xl font-bold mb-6 text-center">General Contractors</h3>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  CityBuild℠ removes the procurement tax that steals your teams' time. Your crews focus on building; the marketplace does the bidding.
                </p>
                
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => router.push('/dashboard?role=contractor')}
                    className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">The System:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>AI instantly reads plans and generates material packages for every trade</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>24/7 GPU-powered bidding engine forces real-time supplier competition</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>No Rolodex, no three-week RFQ cycles, no back-and-forth calls</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>One bid result: best price, delivery, terms—guaranteed lowest cost</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Net Result:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Teams focus on what they're good at—managing crews and delivering work</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>See every available job in your city in real time</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Get paid faster with protected margins</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Scale without scaling back-office overhead</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subcontractor' && (
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
                <h3 className="text-3xl font-bold mb-6 text-center">Subcontractors</h3>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  CityBuild℠ is your competitive advantage wrapped into one workflow: it kills the back-office work, guarantees you the lowest material prices anywhere, and keeps cash moving.
                </p>
                
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => router.push('/dashboard?role=subcontractor')}
                    className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">What Changes:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>No more hours spent sourcing, comparing, and negotiating materials</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>AI + GPU engine runs bidding 24/7 while you manage crews</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>One click locks lowest price available in America</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Project funding verified upfront—no extending credit or dealing with non-paying clients</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-4">The Result:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Spend time building and managing crews—the stuff that makes money</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Overhead drops, margins get protected</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Cash moves faster with guaranteed payment</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Scale volume without scaling headcount</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'supplier' && (
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
                <h3 className="text-3xl font-bold mb-6 text-center">Distributors</h3>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  CityBuild℠ is a 24/7 demand engine that converts guesswork into verified project orders you can bid, win, and fulfill at scale—without your sales team burning the week chasing quotes.
                </p>
                
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => router.push('/dashboard?role=supplier')}
                    className="px-8 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Competitive Advantage:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>AI instantly routes verified material lists to all eligible suppliers</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>GPU-native infrastructure processes thousands of competing bids in real time</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>No manual quoting, no "let me check inventory" delays</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-primary font-bold">•</span>
                        <span>When you win, you win clean: locked price, verified funding</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Result:</h4>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Focus on supply chain and delivery—not quoting</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Steady stream of high-confidence orders</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Scale volume without scaling back-office overhead</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Real-time market data and project intelligence</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Key Differentiators */}
      <section className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">Key Differentiators</h2>
            <p className="text-xl text-muted-foreground">
              What makes CityBuild℠ the only platform that can deliver on these promises
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950/50 dark:to-orange-900/50 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">24/7 AI + GPU Processing</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">No human can match this scale and speed</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50 border border-green-200 dark:border-green-700 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">Funding Verification</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Locked in upfront, eliminates payment risk</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-900/50 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">Competitive Bidding</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Guarantees lowest price marketplace</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-900/50 border border-purple-200 dark:border-purple-700 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-200">Integrated Payments</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Flexible terms, securitized credit, faster payouts</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950/50 dark:to-rose-900/50 border border-pink-200 dark:border-pink-700 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-pink-800 dark:text-pink-200">Real-time Intelligence</h3>
              <p className="text-sm text-pink-700 dark:text-pink-300">Each party sees available work and market data</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950/50 dark:to-cyan-900/50 border border-teal-200 dark:border-teal-700 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-teal-800 dark:text-teal-200">Zero Back-office Friction</h3>
              <p className="text-sm text-teal-700 dark:text-teal-300">Teams focus on core business activities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Partners Section */}
      <section id="partners" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Bank Partners</h2>
            <p className="text-xl text-muted-foreground">
              Partner with CityBuild℠ to power construction projects through our verified marketplace
            </p>
          </div>

          {/* Call to Action */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-2 border-primary rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-primary">Become a Banking Partner</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Join our network of financial institutions powering the future of construction procurement
              </p>
              <a 
                href="mailto:abraham@citybuild.io?subject=Banking%20Partnership%20Inquiry"
                className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-2xl">✉️</span>
                <span>Email Us</span>
              </a>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Banking Partnership Benefits</h3>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">For Banks:</h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Verified project data and funding requirements</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Real-time project progress and material cost tracking</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Reduced credit risk through transparent marketplace</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Streamlined loan processing and disbursement</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">For Projects:</h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Competitive financing rates through partner network</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Faster loan approval with verified project data</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Flexible payment terms and credit options</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Integrated payment systems for all stakeholders</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/20 dark:via-gray-950/20 dark:to-zinc-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-primary">The CityBuild℠ Leadership</h2>
            <p className="text-xl text-muted-foreground">
              Construction, real estate, and technology industry experts determined to build a new marketplace for construction transactions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-primary">
                <Image
                  src="/image/team/Abraham P. Ng'hwani.jpeg"
                  alt="Abraham P. Ng'hwani"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Abraham P. Ng'hwani</h3>
              <p className="text-primary font-medium mb-3">Founder & CEO</p>
              <p className="text-muted-foreground text-sm">
                Founded Abranova in 2016 with currently a $100M track record in construction and real estate development. Invented four patents and launched CityBuild℠ in 2025 to transform the construction transactions marketplace with an AI-native platform and integrated GPU models and technologies.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-secondary">
                <Image
                  src="/image/team/Leonardo Williams.jpeg"
                  alt="Leonardo Williams"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Leonardo Williams</h3>
              <p className="text-primary font-medium mb-3">Business Development</p>
              <p className="text-muted-foreground text-sm">
                The Mayor of Durham, restaurateur and entrepreneur. Recognized by Triangle Business Journal's "40 Under 40" and President Biden.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-accent">
                <Image
                  src="/image/team/Xinjue Cao.jpeg"
                  alt="Julia Cao"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Julia Cao</h3>
              <p className="text-primary font-medium mb-3">Chief Financial Officer</p>
              <p className="text-muted-foreground text-sm">
                7+ years in construction and real estate investment management. Bachelor and Master's in Architecture Engineering from University of Tokyo. MBA from Duke University. CFA charter holder and active real estate investor.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-primary">
                <Image
                  src="/image/team/Steven McClelland.jpeg"
                  alt="Steven McClelland"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Steven McClelland</h3>
              <p className="text-primary font-medium mb-3">Chief Product Officer</p>
              <p className="text-muted-foreground text-sm">
                25+ years building digital solutions. Former Director of Product at Twitter and VP at Yahoo!. Duke University Executive in Residence at Pratt School of Engineering.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-brand-600">
                <Image
                  src="/image/team/Deborah Liu .jpeg"
                  alt="Deborah Liu"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Deborah Liu</h3>
              <p className="text-primary font-medium mb-3">Board Member</p>
              <p className="text-muted-foreground text-sm">
                Silicon Valley leader with 20+ years in consumer technology. Former CEO of Ancestry and leader at Meta, PayPal, and eBay. Built multiple billion-dollar businesses.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-brand-500">
                <Image
                  src="/image/team/Lance Keller .jpeg"
                  alt="Lance Keller"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lance Keller</h3>
              <p className="text-primary font-medium mb-3">Board Member</p>
              <p className="text-muted-foreground text-sm">
                Founder of Lifestyle Homes, LLC with $0.3 billion annual revenue and 20+ years in homebuilding and real estate development. Former senior leadership at KB Home and president of Elite Communities.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-brand-400">
                <Image
                  src="/image/team/Stevan Pardo.jpeg"
                  alt="Stevan Pardo"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Stevan Pardo</h3>
              <p className="text-primary font-medium mb-3">Board Member</p>
              <p className="text-muted-foreground text-sm">
                30+ years as construction litigator. Leading authority on Florida construction and corporate hospitality law. Represented all aspects of the construction industry. Board member to a billion-dollar real estate private equity firm.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-brand-300">
                <Image
                  src="/image/team/Michael Baxter.jpeg"
                  alt="Michael Baxter"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Michael Baxter</h3>
              <p className="text-primary font-medium mb-3">Board Member</p>
              <p className="text-muted-foreground text-sm">
                Co-Owner and President of Baxter Development and Fourth Generation Owner of Baxter Construction Company. Leading a $0.3 billion annual revenue company with Trust, Performance, and Results.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-display-md text-primary mb-6">Ready to Transform Your Construction <span style={{ color: 'var(--accent)' }}>Procurement?</span></h2>
            <p className="text-xl text-muted-foreground mb-12">
              Join the marketplace that's making construction easier, cheaper, faster—and fully transparent.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => scrollToSection('stakeholders')}
                className="btn-primary text-lg px-10 py-4"
              >
                Get Started Today
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-10 py-4 border-2 border-accent bg-accent/10 text-accent-foreground rounded-xl font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300 text-lg"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:opacity-80 transition-opacity">
                <CityBuildLogo size="md" showText={true} />
              </button>
              <p className="text-muted-foreground mt-4 max-w-md">
                Transforming construction procurement through AI-powered marketplace technology. Making projects more predictable, transparent, and efficient.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">How it Works</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => { setActiveTab('bank'); scrollToSection('stakeholders'); }} className="hover:text-foreground transition-colors">Banks</button></li>
                <li><button onClick={() => { setActiveTab('owner'); scrollToSection('stakeholders'); }} className="hover:text-foreground transition-colors">Owners</button></li>
                <li><button onClick={() => { setActiveTab('contractor'); scrollToSection('stakeholders'); }} className="hover:text-foreground transition-colors">General Contractors</button></li>
                <li><button onClick={() => { setActiveTab('subcontractor'); scrollToSection('stakeholders'); }} className="hover:text-foreground transition-colors">Subcontractors</button></li>
                <li><button onClick={() => { setActiveTab('supplier'); scrollToSection('stakeholders'); }} className="hover:text-foreground transition-colors">Distributors</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => scrollToSection('team')} className="hover:text-foreground transition-colors">About Team</button></li>
                <li>
                  <a href="tel:+19195970020" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <span>📞</span>
                    <span>+1 (919) 597-0020</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:abraham@citybuild.io" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <span>✉️</span>
                    <span>abraham@citybuild.io</span>
                  </a>
                </li>
                {/* <li><a href="/careers" className="hover:text-foreground transition-colors">Careers</a></li> */}
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 City Build AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</a>
              <a href="/security" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}