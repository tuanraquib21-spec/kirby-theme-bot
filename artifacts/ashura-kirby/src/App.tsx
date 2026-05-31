import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Star, Download, ExternalLink, Shield, ChevronRight, Sparkles, Users, Wifi } from "lucide-react";
import bannerImg from "@assets/image_1597014d_1780235067184.png";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const rules = [
  { num: 1, title: "Realm Standard Language", desc: "Communications within public channels must be in English." },
  { num: 2, title: "Sanctity of All Users", desc: "Treat everyone with unwavering respect. No exceptions." },
  { num: 3, title: "Restricted Doctrines", desc: "No advertisement or self-promotion of outside guilds, servers, or personal ventures." },
  { num: 4, title: "Zero Discrimination", desc: "Prejudice of any kind is an immediate exile." },
  { num: 5, title: "No Profane Imagery", desc: "NSFW or gory material is banned. This applies to avatars, statuses, and links." },
  { num: 6, title: "Restricted Language", desc: "Slurs are permitted only if you are reclaiming them and possess the bypass role. Exploiting this will result in loss of role." },
  { num: 7, title: "The Great Taboo", desc: "Sexual jokes involving themes of violation, unwanted touching, or lack of consent are permanently forbidden." },
  { num: 8, title: "Code of Originality", desc: "Do not replicate, plagiarize, or heavily take inspiration from ashura." },
];

interface DiscordStats {
  name: string;
  memberCount: number;
  onlineCount: number;
  icon: string | null;
}

function DiscordWidget() {
  const [stats, setStats] = useState<DiscordStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/discord-stats`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex items-center gap-5 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm">
      {loading ? (
        <div className="flex gap-4 animate-pulse">
          <div className="w-24 h-8 bg-white/10 rounded-lg" />
          <div className="w-24 h-8 bg-white/10 rounded-lg" />
        </div>
      ) : stats ? (
        <>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--app-font-display)" }}>
              {stats.memberCount.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">members</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
            <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--app-font-display)" }}>
              {stats.onlineCount.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">online</span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Wifi size={14} />
          <span>Join dsc.gg/ashura</span>
        </div>
      )}
    </div>
  );
}

function StarField() {
  const stars = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.round((i * 137.5) % 100),
    y: Math.round((i * 97.3) % 100),
    size: [10, 14, 18, 12][i % 4],
    dur: [3, 4, 5, 2.5, 3.5][i % 5],
    delay: (i * 0.37) % 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* radial glow blobs */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(255,92,141,0.18) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(200,162,232,0.12) 0%, transparent 70%)" }} />

      {/* grid */}
      <div className="absolute inset-0 grid-bg opacity-100" />

      {/* stars */}
      {stars.map(s => (
        <svg
          key={s.id}
          className="absolute star-particle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            "--duration": `${s.dur}s`,
            "--delay": `${s.delay}s`,
          } as React.CSSProperties}
          viewBox="0 0 20 20"
        >
          <polygon
            points="10,1 12.5,8 19,8 14,12.5 16,19 10,15 4,19 6,12.5 1,8 7.5,8"
            fill={s.id % 3 === 0 ? "#FFD700" : s.id % 3 === 1 ? "#ff5c8d" : "#c8a2e8"}
            opacity="0.7"
          />
        </svg>
      ))}
    </div>
  );
}

function Navbar() {
  return (
    <nav className="navbar px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 20 20" className="text-primary">
            <polygon
              points="10,1 12.5,8 19,8 14,12.5 16,19 10,15 4,19 6,12.5 1,8 7.5,8"
              fill="#ff5c8d"
            />
          </svg>
          <span className="font-display font-700 text-lg text-white tracking-tight">/ashura</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#rules"
            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block"
          >
            Rules
          </a>
          <a
            href="#theme"
            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block"
          >
            BD Theme
          </a>
          <a
            href="https://dsc.gg/ashura"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm !py-2 !px-5 !text-base"
          >
            Join
          </a>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="min-h-screen relative w-full">
      <StarField />
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-gradient relative z-10 pt-32 pb-24 px-4 flex flex-col items-center text-center">
        <div className="section-label mb-8 justify-center">
          <span>Welcome to Dream Land</span>
        </div>

        {/* Banner */}
        <div className="relative w-full max-w-4xl mx-auto mb-10 glow-pink rounded-3xl overflow-hidden drift">
          <img
            src={bannerImg}
            alt="Ashura Server Banner"
            className="w-full h-auto block"
            style={{ borderRadius: "24px" }}
          />
          <div className="absolute inset-0 rounded-3xl" style={{
            background: "linear-gradient(180deg, transparent 60%, rgba(10,4,18,0.8) 100%)"
          }} />
        </div>

        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-none mb-4 text-glow-white"
          style={{ fontFamily: "var(--app-font-display)" }}
        >
          /ashura
        </h1>

        <p className="text-lg text-muted-foreground mb-3 max-w-md">
          Owned by <span className="text-primary font-semibold">RealAsh</span> &nbsp;&middot;&nbsp; Created by <span className="text-accent font-semibold">Alpy</span>
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
          <Sparkles size={14} className="text-secondary animate-pulse-glow" />
          Add <strong className="text-primary mx-1">dsc.gg/ashuracommunity</strong> to your status for a special role
        </div>

        <DiscordWidget />

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <a
            href="https://dsc.gg/ashura"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <polygon points="10,1 12.5,8 19,8 14,12.5 16,19 10,15 4,19 6,12.5 1,8 7.5,8" fill="currentColor" />
            </svg>
            Join the Server
            <ChevronRight size={18} />
          </a>
          <a href="#rules" className="btn-secondary">
            View Rules
          </a>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="relative z-10 border-y border-border/40 bg-card/30 backdrop-blur-sm py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Owner", value: "RealAsh" },
            { label: "Since", value: "2026" },
            { label: "Invite", value: "dsc.gg/ashura" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl font-bold text-white" style={{ fontFamily: "var(--app-font-display)" }}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RULES ── */}
      <section id="rules" className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label justify-center mb-4"><span>The Realm Codex</span></div>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--app-font-display)" }}>
              Server Rules
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              By entering this realm, you agree to uphold our sacred principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rules.map((rule) => (
              <div
                key={rule.num}
                className="gradient-border group hover:scale-[1.015] transition-transform duration-200 p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="rule-num shrink-0 mt-0.5">0{rule.num}</span>
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1.5 leading-snug"
                      style={{ fontFamily: "var(--app-font-display)", fontSize: "1.05rem" }}>
                      {rule.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final Directive */}
          <div className="mt-8 relative overflow-hidden rounded-2xl border border-primary/30 p-8 text-center"
            style={{ background: "linear-gradient(135deg, rgba(255,92,141,0.12) 0%, rgba(200,162,232,0.08) 100%)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, rgba(255,92,141,0.15) 0%, transparent 60%)" }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-primary mb-4">
                <Shield size={18} />
                <span className="font-semibold text-sm tracking-wide uppercase" style={{ fontFamily: "var(--app-font-display)" }}>
                  Final Directive
                </span>
              </div>
              <p className="text-white font-semibold text-lg max-w-2xl mx-auto leading-relaxed mb-2"
                style={{ fontFamily: "var(--app-font-display)" }}>
                Adhere to Discord's official Terms of Service &amp; Guidelines.
              </p>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                If the High Council (Staff) finds a loophole, they will close it with force.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BETTERDISCORD THEME ── */}
      <section id="theme" className="relative z-10 py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label justify-center mb-4"><span>Kirby Theme</span></div>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--app-font-display)" }}>
              BetterDiscord Skin
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Transform your Discord client into Dream Land. Full Kirby-themed UI — dark backgrounds, pink glows, star cursors, and more.
            </p>
          </div>

          <div className="download-card">
            {/* Preview dots */}
            <div className="flex gap-1.5 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>

            {/* Code preview */}
            <div className="bg-black/40 rounded-xl p-5 mb-8 font-mono text-sm border border-white/5 overflow-x-auto">
              <div className="text-muted-foreground">
                <span className="text-accent">/**</span><br />
                <span className="text-accent ml-2">* @name</span> <span className="text-primary">KirbyAshura</span><br />
                <span className="text-accent ml-2">* @version</span> <span className="text-white">1.0.0</span><br />
                <span className="text-accent ml-2">* @description</span> <span className="text-white">Kirby-themed Discord skin for /ashura</span><br />
                <span className="text-accent">*/</span><br /><br />
                <span className="text-muted-foreground/60">/* Deep purple-black backgrounds */</span><br />
                <span className="text-secondary">--background-primary</span><span className="text-white">: </span><span className="text-primary">#1a0828</span><span className="text-white">;</span><br />
                <span className="text-secondary">--brand-experiment</span><span className="text-white">: </span><span className="text-primary">#ff5c8d</span><span className="text-white">;</span><br />
                <span className="text-muted-foreground/60">/* ...and much more */</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="/KirbyAshura.theme.css"
                download="KirbyAshura.theme.css"
                className="btn-primary flex-1 justify-center"
              >
                <Download size={20} />
                Download Theme
              </a>
              <div className="text-muted-foreground text-sm text-center">
                Requires <a
                  href="https://betterdiscord.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  BetterDiscord <ExternalLink size={12} />
                </a>
                <br />
                Place in <code className="text-accent bg-black/30 px-1 rounded">themes/</code> folder
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { label: "Background", color: "#1a0828" },
                { label: "Primary", color: "#ff5c8d" },
                { label: "Accent", color: "#c8a2e8" },
                { label: "Stars", color: "#ffd700" },
              ].map(({ label, color }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white/10"
                    style={{ background: color, boxShadow: `0 0 12px ${color}55` }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-border/40 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star size={16} className="text-primary" fill="currentColor" />
            <span className="font-bold text-white" style={{ fontFamily: "var(--app-font-display)" }}>/ashura</span>
            <Star size={16} className="text-primary" fill="currentColor" />
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            A Dream Land community — all rights reserved.
          </p>
          <a
            href="https://dsc.gg/ashura"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-colors font-semibold text-sm"
          >
            dsc.gg/ashura
          </a>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Home />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
