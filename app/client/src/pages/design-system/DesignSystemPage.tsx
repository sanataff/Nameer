import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Cookie,
  LayoutDashboard,
  Moon,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Sun,
  Store,
  Truck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import './design-system.css'

const colorRoles = [
  { name: 'Canvas', token: 'background / foreground', background: '#ffffff', foreground: '#1d1b19' },
  { name: 'Card', token: 'card / card-foreground', background: '#ffffff', foreground: '#1d1b19' },
  { name: 'Primary action', token: 'primary / primary-foreground', background: '#a87445', foreground: '#ffffff' },
  { name: 'Secondary', token: 'secondary / secondary-foreground', background: '#f2eee9', foreground: '#302a25' },
  { name: 'Muted', token: 'muted / muted-foreground', background: '#f5f3f0', foreground: '#625b54' },
  { name: 'Success', token: 'status-success / on-success', background: '#eaf3ec', foreground: '#326344' },
  { name: 'Warning', token: 'status-warning / on-warning', background: '#fbf1da', foreground: '#76500f' },
  { name: 'Destructive', token: 'destructive / on-destructive', background: '#b5473b', foreground: '#ffffff' },
]

const palette = [
  { name: '50', value: '#f8f3ee' },
  { name: '100', value: '#efe1d2' },
  { name: '200', value: '#e1c5a8' },
  { name: '300', value: '#cfaa82' },
  { name: '400', value: '#bb8e60' },
  { name: '500 · brand', value: '#a87445' },
  { name: '600', value: '#91633c' },
  { name: '700', value: '#754c2f' },
  { name: '800', value: '#5b3b27' },
  { name: '900', value: '#40291c' },
]

function luminance(hex: string) {
  const channels = hex.match(/[a-f\d]{2}/gi)?.map((channel) => {
    const value = parseInt(channel, 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  if (!channels || channels.length !== 3) return 0
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrastRatio(first: string, second: string) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

export function DesignSystemPage() {
  const [dark, setDark] = useState(false)

  return (
    <div className={`design-system-page${dark ? ' theme-dark' : ''}`}>
      <header className="ds-topbar">
        <a className="ds-brand" href="/" aria-label="Nameer home">
          <span className="ds-brand-mark" aria-hidden="true">ن</span>
          <span>Nameer</span>
          <span className="ds-brand-divider" />
          <span className="ds-brand-caption">Design system</span>
        </a>
        <nav className="ds-top-links" aria-label="Design system navigation">
          <a href="#foundations">Foundations</a>
          <a href="#components">Components</a>
          <a href="#patterns">Patterns</a>
        </nav>
        <div className="ds-top-actions">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setDark((previous) => !previous)}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {dark ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />}
            {dark ? 'Light' : 'Dark'}
          </Button>
          <a className="ds-back-link" href="/">Open Nameer <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </header>

      <div className="ds-layout">
        <aside className="ds-sidebar">
          <span className="ds-sidebar-label">IN THIS SYSTEM</span>
          <a href="#overview">Overview</a>
          <a href="#foundations">Foundations</a>
          <a href="#components">Components</a>
          <a href="#patterns">Product patterns</a>
          <a href="#principles">Principles</a>
          <div className="ds-sidebar-note">
            <ShieldCheck aria-hidden="true" />
            <p>Designed for trusted local food businesses.</p>
          </div>
        </aside>

        <main className="ds-main">
          <section className="ds-hero" id="overview">
            <div className="ds-hero-copy">
              <Badge variant="secondary">NAMEER · PRODUCT UI</Badge>
              <h1>Local food.<br /><span>Better connected.</span></h1>
              <p>
                A warm, clear toolkit for the people behind Saudi Arabia’s cafés,
                restaurants, and independent food businesses.
              </p>
              <div className="ds-hero-tags">
                <span><Check aria-hidden="true" /> Arabic-first</span>
                <span><Check aria-hidden="true" /> B2B commerce</span>
                <span><Check aria-hidden="true" /> Built for trust</span>
              </div>
            </div>
            <div className="ds-hero-art" aria-hidden="true">
              <div className="ds-art-sun" />
              <div className="ds-art-arch">
                <div className="ds-art-bowl"><span /><span /><span /></div>
              </div>
              <span className="ds-art-caption">Made nearby, shared together</span>
            </div>
          </section>

          <section className="ds-section" id="foundations">
            <div className="ds-section-heading">
              <div>
                <span className="ds-kicker">01 / FOUNDATIONS</span>
                <h2>Color with a sense of place</h2>
                <p>Warm, grounded surfaces let products and people take the lead.</p>
              </div>
              <span className="ds-source-note">Brand seed from the current Nameer UI</span>
            </div>

            <div className="ds-color-role-grid">
              {colorRoles.map((role) => {
                const ratio = contrastRatio(role.background, role.foreground)
                const passes = ratio >= 4.5
                return (
                  <article className="ds-color-role" key={role.name}>
                    <div className="ds-role-sample" style={{ backgroundColor: role.background, color: role.foreground }}>
                      <span>Aa</span>
                      <span className="ds-role-ratio">{ratio.toFixed(1)}:1 {passes ? 'AA' : 'Large text'}</span>
                    </div>
                    <div className="ds-role-meta">
                      <strong>{role.name}</strong>
                      <code>{role.token}</code>
                    </div>
                  </article>
                )
              })}
            </div>
            <p className="ds-contrast-note">
              Contrast is calculated from the displayed color pair. The current primary/white
              pairing is below 4.5:1 for normal-size text; use primary for larger labels and
              prioritize readable foregrounds for small text.
            </p>

            <div className="ds-subheading">
              <div>
                <h3>Nameer ochre</h3>
                <p>Core brand scale · primary currently resolves to approximately #A87445.</p>
              </div>
            </div>
            <div className="ds-palette">
              {palette.map((shade) => (
                <div className="ds-palette-swatch" key={shade.name}>
                  <div style={{ backgroundColor: shade.value }} />
                  <strong>{shade.name}</strong>
                  <code>{shade.value}</code>
                </div>
              ))}
            </div>

            <div className="ds-foundation-grid">
              <Card className="ds-foundation-card">
                <CardHeader>
                  <CardTitle>Type that feels natural</CardTitle>
                  <CardDescription>Geist for Latin · Tahoma / system Arabic fallback</CardDescription>
                </CardHeader>
                <CardContent className="ds-type-specimens">
                  <div><span>Display / 32 · 600</span><strong className="ds-type-display">From your kitchen</strong></div>
                  <div><span>Heading / 22 · 600</span><strong className="ds-type-heading">Products</strong></div>
                  <div><span>Body / 14 · 400</span><p>Good food, made locally and ready to supply.</p></div>
                  <div><span>Arabic specimen / RTL</span><p className="ds-arabic" dir="rtl">منتجات محلية بطابع مميز</p></div>
                </CardContent>
              </Card>
              <Card className="ds-foundation-card">
                <CardHeader>
                  <CardTitle>Space, shape & depth</CardTitle>
                  <CardDescription>Compact controls with comfortable breathing room.</CardDescription>
                </CardHeader>
                <CardContent className="ds-token-list">
                  <div className="ds-space-token"><span>4</span><i style={{ width: 4 }} /><code>4px · icon gap</code></div>
                  <div className="ds-space-token"><span>8</span><i style={{ width: 8 }} /><code>8px · tight group</code></div>
                  <div className="ds-space-token"><span>16</span><i style={{ width: 16 }} /><code>16px · component inset</code></div>
                  <div className="ds-space-token"><span>24</span><i style={{ width: 24 }} /><code>24px · section rhythm</code></div>
                  <div className="ds-radius-samples">
                    <span className="ds-radius-box ds-radius-sm">6px</span>
                    <span className="ds-radius-box ds-radius-md">10px</span>
                    <span className="ds-radius-box ds-radius-lg">16px</span>
                    <span>Small / default / feature surface</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="ds-section ds-section-band" id="components">
            <div className="ds-section-heading">
              <div>
                <span className="ds-kicker">02 / COMPONENTS</span>
                <h2>Made for everyday decisions</h2>
                <p>Clear actions and status at a glance, from listing a product to confirming a request.</p>
              </div>
            </div>
            <div className="ds-component-grid">
              <Card className="ds-component-card">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>One clear primary action per surface.</CardDescription>
                </CardHeader>
                <CardContent className="ds-example-stack">
                  <div className="ds-example-row">
                    <Button type="button"><Plus data-icon="inline-start" /> Add product</Button>
                    <Button variant="outline" type="button">Cancel</Button>
                  </div>
                  <div className="ds-example-row">
                    <Button variant="secondary" type="button">View details</Button>
                    <Button variant="destructive" type="button">Remove</Button>
                  </div>
                  <div className="ds-example-row">
                    <Button variant="outline" size="sm" type="button"><Package data-icon="inline-start" /> Small action</Button>
                    <Button variant="ghost" size="icon" type="button" aria-label="Search"><Search /></Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="ds-component-card">
                <CardHeader>
                  <CardTitle>Product status</CardTitle>
                  <CardDescription>Use text labels with color; never rely on color alone.</CardDescription>
                </CardHeader>
                <CardContent className="ds-example-stack">
                  <div className="ds-badge-row">
                    <Badge className="ds-status-available"><CircleCheck data-icon="inline-start" /> Available</Badge>
                    <Badge className="ds-status-low"><Clock3 data-icon="inline-start" /> Low stock</Badge>
                    <Badge variant="secondary">Paused</Badge>
                    <Badge variant="destructive">Out of stock</Badge>
                  </div>
                  <div className="ds-request-status"><span className="ds-status-dot" /> Order request <strong>Pending</strong><ChevronDown aria-hidden="true" /></div>
                </CardContent>
              </Card>
              <Card className="ds-component-card ds-input-card">
                <CardHeader>
                  <CardTitle>Search & discovery</CardTitle>
                  <CardDescription>Keep the catalog easy to scan and refine.</CardDescription>
                </CardHeader>
                <CardContent className="ds-example-stack">
                  <label className="ds-input-label" htmlFor="ds-product-search">Search products</label>
                  <div className="ds-search-field"><Search aria-hidden="true" /><Input id="ds-product-search" placeholder="Try “date cookies”" /></div>
                  <div className="ds-search-filters">
                    <Badge variant="outline">All categories <ChevronDown aria-hidden="true" /></Badge>
                    <Badge variant="outline">Available now <ChevronDown aria-hidden="true" /></Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="ds-section" id="patterns">
            <div className="ds-section-heading">
              <div>
                <span className="ds-kicker">03 / PRODUCT PATTERNS</span>
                <h2>Real work, clearly presented</h2>
                <p>Use familiar catalog and order patterns for cafés and suppliers.</p>
              </div>
              <Badge variant="outline">Demo content</Badge>
            </div>
            <Card className="ds-catalog-card">
              <div className="ds-catalog-toolbar">
                <div className="ds-catalog-heading">
                  <span className="ds-catalog-icon"><LayoutDashboard aria-hidden="true" /></span>
                  <div><strong>Your products</strong><span>Visible to cafés on Nameer</span></div>
                </div>
                <Button type="button" size="sm"><Plus data-icon="inline-start" /> Add product</Button>
              </div>
              <div className="ds-catalog-table-wrap">
                <table className="ds-catalog-table">
                  <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Availability</th><th aria-label="Actions" /></tr></thead>
                  <tbody>
                    <tr>
                      <td><span className="ds-product-icon"><Cookie aria-hidden="true" /></span><span className="ds-product-name">Date & tahini bites<small>Box of 16 · Homemade</small></span></td>
                      <td>Sweets</td><td>32 SAR</td><td><Badge className="ds-status-available">Available · 24</Badge></td>
                      <td><Button variant="ghost" size="sm" type="button">Edit</Button></td>
                    </tr>
                    <tr>
                      <td><span className="ds-product-icon ds-product-icon-peach"><Package aria-hidden="true" /></span><span className="ds-product-name">Sourdough loaf<small>800 g · Slow fermented</small></span></td>
                      <td>Bakery</td><td>26 SAR</td><td><Badge className="ds-status-low">Low stock · 4</Badge></td>
                      <td><Button variant="ghost" size="sm" type="button">Edit</Button></td>
                    </tr>
                    <tr>
                      <td><span className="ds-product-icon ds-product-icon-green"><Truck aria-hidden="true" /></span><span className="ds-product-name">Za’atar manakish<small>Pack of 6 · Ready daily</small></span></td>
                      <td>Savory</td><td>18 SAR</td><td><Badge variant="secondary">Paused</Badge></td>
                      <td><Button variant="ghost" size="sm" type="button">Edit</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="ds-catalog-footnote"><span>Showing 3 example products</span><span>Prices in Saudi riyals (SAR)</span></div>
            </Card>

            <div className="ds-pattern-grid">
              <Card className="ds-pattern-card">
                <CardHeader>
                  <span className="ds-pattern-icon"><Store aria-hidden="true" /></span>
                  <CardTitle>For cafés & restaurants</CardTitle>
                  <CardDescription>Discover verified local suppliers, compare products, request samples, and follow orders.</CardDescription>
                </CardHeader>
                <CardContent><a href="#components">Browse suppliers <ArrowUpRight aria-hidden="true" /></a></CardContent>
              </Card>
              <Card className="ds-pattern-card">
                <CardHeader>
                  <span className="ds-pattern-icon ds-pattern-icon-warm"><Package aria-hidden="true" /></span>
                  <CardTitle>For suppliers</CardTitle>
                  <CardDescription>Share a professional catalog, manage availability, respond to requests, and track revenue.</CardDescription>
                </CardHeader>
                <CardContent><a href="#components">Manage products <ArrowUpRight aria-hidden="true" /></a></CardContent>
              </Card>
              <Card className="ds-pattern-card ds-rtl-card" dir="rtl">
                <CardHeader>
                  <span className="ds-pattern-icon"><ShieldCheck aria-hidden="true" /></span>
                  <CardTitle>واجهة عربية من اليمين إلى اليسار</CardTitle>
                  <CardDescription>اعرض حالة الطلب والمعلومات الأساسية بوضوح، مع دعم كامل لاتجاه القراءة العربية.</CardDescription>
                </CardHeader>
                <CardContent><a href="#components">استكشف المنتجات <ArrowUpRight aria-hidden="true" /></a></CardContent>
              </Card>
            </div>
          </section>

          <section className="ds-section ds-principles" id="principles">
            <div className="ds-section-heading">
              <div>
                <span className="ds-kicker">04 / PRINCIPLES</span>
                <h2>Trust is part of the interface</h2>
              </div>
            </div>
            <div className="ds-principle-list">
              <div><span>01</span><strong>Make the next step obvious</strong><p>Prefer one clear, specific action over several competing calls to action.</p></div>
              <div><span>02</span><strong>Be transparent about status</strong><p>Show availability, order state, and verification with direct labels.</p></div>
              <div><span>03</span><strong>Respect every reading direction</strong><p>Use logical layout properties and test Arabic content in true RTL context.</p></div>
              <div><span>04</span><strong>Keep food and people central</strong><p>Use warm accents sparingly; maintain calm, readable surfaces.</p></div>
            </div>
          </section>

          <footer className="ds-footer">
            <a className="ds-brand" href="/">
              <span className="ds-brand-mark" aria-hidden="true">ن</span>
              <span>Nameer</span>
            </a>
            <span>A shared table for local food businesses.</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
