import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Star, Cloud, Sparkles, Heart, ShieldAlert, BookOpen, Quote, MessagesSquare, Users, ImageMinus, Ban, HandHeart, CopyX } from "lucide-react";
import bannerImg from "@assets/image_1780234764214.png";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const rules = [
  {
    num: 1,
    title: "Realm Standard Language",
    desc: "Communications within public channels must be in English.",
    icon: <MessagesSquare className="text-blue-400" size={28} />,
    color: "bg-blue-100"
  },
  {
    num: 2,
    title: "Sanctity of All Users",
    desc: "Treat everyone with unwavering respect. No exceptions.",
    icon: <Heart className="text-pink-400" size={28} />,
    color: "bg-pink-100"
  },
  {
    num: 3,
    title: "Restricted Doctrines",
    desc: "No advertisement or self-promotion of outside guilds, servers, or personal ventures.",
    icon: <Ban className="text-red-400" size={28} />,
    color: "bg-red-100"
  },
  {
    num: 4,
    title: "Zero Discrimination",
    desc: "Prejudice of any kind is an immediate exile.",
    icon: <ShieldAlert className="text-orange-400" size={28} />,
    color: "bg-orange-100"
  },
  {
    num: 5,
    title: "No Profane Imagery",
    desc: "NSFW or gory material is banned. This applies to avatars, statuses, and links.",
    icon: <ImageMinus className="text-purple-400" size={28} />,
    color: "bg-purple-100"
  },
  {
    num: 6,
    title: "Restricted Language",
    desc: "Slurs are permitted only if you are reclaiming them and possess the bypass role. Exploiting this will result in loss of role.",
    icon: <Quote className="text-teal-400" size={28} />,
    color: "bg-teal-100"
  },
  {
    num: 7,
    title: "The Great Taboo",
    desc: "Sexual jokes involving themes of violation, unwanted touching, or lack of consent are permanently forbidden.",
    icon: <HandHeart className="text-rose-400" size={28} />,
    color: "bg-rose-100"
  },
  {
    num: 8,
    title: "Code of Originality",
    desc: "Do not replicate, plagiarize, or heavily take inspiration from ashura.",
    icon: <CopyX className="text-indigo-400" size={28} />,
    color: "bg-indigo-100"
  }
];

function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <Star className="absolute top-[10%] left-[15%] text-secondary animate-float opacity-70" size={64} fill="currentColor" />
      <Cloud className="absolute top-[20%] right-[10%] text-white animate-float-slow opacity-80" size={96} fill="currentColor" />
      <Sparkles className="absolute top-[40%] left-[5%] text-accent animate-pulse-soft opacity-60" size={48} />
      <Star className="absolute top-[60%] right-[20%] text-secondary animate-float-fast opacity-50" size={56} fill="currentColor" />
      <Cloud className="absolute bottom-[20%] left-[10%] text-white animate-float-slow opacity-90" size={120} fill="currentColor" />
      <Heart className="absolute bottom-[30%] right-[15%] text-primary animate-float opacity-40" size={40} fill="currentColor" />
      <Star className="absolute bottom-[10%] left-[40%] text-yellow-300 animate-pulse-soft opacity-80" size={32} fill="currentColor" />
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-[100dvh] relative w-full flex flex-col items-center">
      <FloatingBackground />
      
      <main className="relative z-10 w-full max-w-5xl px-4 py-16 flex flex-col items-center gap-16">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-8 w-full">
          <div className="relative animate-float-slow group">
            <div className="absolute -inset-2 bg-white rounded-[3rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <img 
              src={bannerImg} 
              alt="Ashura Server Banner" 
              className="relative w-full max-w-3xl rounded-[3rem] border-[12px] border-white shadow-2xl object-cover aspect-[21/9]"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-primary tracking-tight" style={{ textShadow: '0 4px 0 #fff, 0 8px 0 rgba(0,0,0,0.1)' }}>
              /ashura
            </h1>
            <p className="text-xl md:text-2xl font-bold text-foreground/80 max-w-lg mx-auto leading-relaxed">
              Owned by <span className="text-primary">RealAsh</span> &bull; Created by <span className="text-accent">Aipy</span>
            </p>
          </div>

          <a 
            href="https://dsc.gg/ashura" 
            target="_blank" 
            rel="noopener noreferrer"
            className="kirby-btn mt-6 inline-flex items-center gap-3 bg-primary text-white text-2xl md:text-3xl font-black px-12 py-6 rounded-full border-4 border-white"
          >
            <Star size={32} fill="currentColor" className="animate-pulse-soft" />
            Join the Server!
            <Star size={32} fill="currentColor" className="animate-pulse-soft" />
          </a>

          <div className="mt-8 bg-white/60 backdrop-blur-md px-8 py-4 rounded-full border-4 border-white shadow-sm inline-flex items-center gap-3">
            <Sparkles className="text-secondary" fill="currentColor" />
            <span className="text-lg font-bold text-foreground">
              Add <strong className="text-primary">dsc.gg/ashura</strong> to your status to get a special role!
            </span>
          </div>
        </section>

        {/* Rules Section */}
        <section className="w-full mt-12 flex flex-col items-center gap-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white" style={{ textShadow: '0 4px 0 hsl(var(--primary)), 0 6px 12px rgba(0,0,0,0.1)' }}>
              Server Rules
            </h2>
            <p className="text-xl font-bold text-primary/80">Please read carefully before joining our dream land!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {rules.map((rule) => (
              <div key={rule.num} className="kirby-card bg-card p-8 rounded-[2.5rem] relative flex flex-col gap-4">
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center font-black text-3xl text-primary border-4 border-card-border shadow-md">
                  {rule.num}
                </div>
                <div className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center ${rule.color}`}>
                  {rule.icon}
                </div>
                <h3 className="text-2xl font-black text-foreground mt-2 pr-12 leading-tight">
                  {rule.title}
                </h3>
                <p className="text-lg font-semibold text-muted-foreground leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Final Directive */}
          <div className="w-full mt-8 kirby-card bg-primary text-white p-10 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <ShieldAlert size={200} />
            </div>
            <div className="relative z-10 flex flex-col gap-4 items-center text-center">
              <div className="bg-white text-primary px-6 py-2 rounded-full font-black tracking-widest uppercase text-sm border-2 border-primary-foreground/20">
                Final Directive
              </div>
              <h3 className="text-2xl md:text-3xl font-black leading-tight max-w-3xl">
                Adhere to Discord's official Terms of Service & Guidelines.
              </h3>
              <p className="text-xl font-bold text-white/90 max-w-2xl">
                If the High Council (Staff) finds a loophole, they will close it with force.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-white/80 backdrop-blur-md py-8 mt-12 border-t-8 border-white text-center flex flex-col items-center gap-2">
        <p className="font-bold text-foreground/60 text-lg">
          &copy; /ashura &mdash; All rights reserved
        </p>
        <a href="https://dsc.gg/ashura" className="font-black text-primary hover:text-accent transition-colors text-xl">
          dsc.gg/ashura
        </a>
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
