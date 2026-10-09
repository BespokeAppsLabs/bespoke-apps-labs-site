"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { type CardData } from "@/components/v1/floating-cards-scene";
import {
  Layers,
  Sparkles,
  LayoutGrid,
  GraduationCap,
  Bot,
  Network,
  ArrowDown,
  Menu,
  X,
  Brain,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

import ProductDetailModal from "@/components/product-detail-modal";
import ContactForm from "@/components/contact-form";
import VersionToggle from "@/components/version-toggle";

const FloatingCardsScene = dynamic(
  () => import("@/components/v1/floating-cards-scene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading experience...</p>
        </div>
      </div>
    )
  }
);

const cards: (CardData & { features?: string[] })[] = [
  {
    id: "hero",
    title: "Bespoke Applications Labs",
    subtitle: "Building the Future",
    description:
      "We craft custom web and mobile applications with cutting-edge AI integration. Transform your business with bespoke digital solutions tailored to your unique needs.",
    icon: <Layers className="w-6 h-6" />,
    color: "#4ecdc4",
  },
  {
    id: "media",
    title: "Bespoke Media",
    subtitle: "AI-Powered Creative Agency",
    description:
      "Revolutionary online advertising powered by artificial intelligence. Generate stunning ad creatives, images, and videos that captivate your audience and drive conversions.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "#f97316",
  },
  {
    id: "os",
    title: "BespokeOS",
    subtitle: "The Business Operating System",
    description:
      "One lead AI operator over every section of the business - build, inbox, clients, media, sites and finance - with a human signing off every consequential step.",
    icon: <LayoutGrid className="w-6 h-6" />,
    color: "#8b5cf6",
  },
  {
    id: "academy",
    title: "Bespoke Academy",
    subtitle: "AI & Digital Literacy",
    description:
      "Comprehensive educational platform teaching artificial intelligence and computer literacy. Empower your team with the skills needed for tomorrow's digital landscape.",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "#ec4899",
  },
  {
    id: "agent",
    title: "Bespoke Agent",
    subtitle: "Custom AI Agents",
    description:
      "Build intelligent agents tailored to your business needs. From AI receptionists and social media managers to personal assistants that work around the clock.",
    icon: <Bot className="w-6 h-6" />,
    color: "#10b981",
  },
  {
    id: "networks",
    title: "Bespoke Networks",
    subtitle: "AI-Managed Infrastructure",
    description:
      "Enterprise-grade network infrastructure for businesses and schools, intelligently managed by AI agents. Reliable, secure, and self-optimizing connectivity.",
    icon: <Network className="w-6 h-6" />,
    color: "#3b82f6",
  },
  {
    id: "consulting",
    title: "Digital Transformation",
    subtitle: "AI Consulting Services",
    description:
      "Strategic consulting to digitize your business and implement AI solutions that drive real value. Not just chatbots - intelligent systems that transform operations.",
    icon: <Brain className="w-6 h-6" />,
    color: "#f59e0b",
  },
  {
    id: "contact",
    title: "Let's Build Together",
    subtitle: "Start Your Journey",
    description:
      "Ready to transform your business with bespoke solutions? Contact us to discuss your vision and discover how we can bring it to life with cutting-edge technology.",
    icon: <Zap className="w-6 h-6" />,
    color: "#4ecdc4",
  },
];

function NavBar({ activeIndex }: { activeIndex: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => window.dispatchEvent(new CustomEvent("nav-jump", { detail: 0 }))}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-500/50 transition-all">
            <span className="text-emerald-500 font-bold text-xl tracking-tight leading-none group-hover:scale-110 transition-transform">
              &lt;/&gt;
            </span>
          </div>
          <span className="font-bold text-xl text-white tracking-tight hidden sm:block">
            Bespoke <span className="text-emerald-500">Labs</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1">
          {["Home", "Products", "About", "Contact"].map((item) => {
            const targetIndices = { Home: 0, Products: 2, About: 6, Contact: 7 };
            return (
              <button
                key={item}
                onClick={() => {
                  const index = targetIndices[item as keyof typeof targetIndices];
                  window.dispatchEvent(new CustomEvent("nav-jump", { detail: index }));
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-all",
                  item === "Home" && activeIndex === 0 ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item}
              </button>
            );
          })}
          <div className="ml-2 pl-2 border-l border-border/30">
            <VersionToggle current="v1" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <VersionToggle current="v1" />
          <button
            className="glass rounded-lg p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 glass rounded-2xl p-4">
          {["Home", "Products", "About", "Contact"].map((item) => (
            <button
              key={item}
              className="block w-full text-left px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-all"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function ScrollIndicator({
  activeIndex,
  total,
}: {
  activeIndex: number;
  total: number;
}) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === activeIndex
              ? "bg-primary scale-150"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
          }`}
        />
      ))}
    </div>
  );
}

function ScrollHint({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 animate-bounce">
      <span className="text-xs text-muted-foreground uppercase tracking-widest">
        Scroll to Explore
      </span>
      <ArrowDown className="w-5 h-5 text-primary" />
    </div>
  );
}

function SectionInfo({
  card,
  index,
  total,
}: {
  card: (typeof cards)[0];
  index: number;
  total: number;
}) {
  return (
    <div className="fixed bottom-8 left-8 z-40 hidden lg:block">
      <div className="glass rounded-xl px-4 py-2">
        <span className="text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="mx-3 text-border">|</span>
        <span className="text-sm text-foreground">{card.title}</span>
      </div>
    </div>
  );
}

export default function V1Page() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(typeof cards)[0] | null>(null);

  const openModal = (product: (typeof cards)[0]) => {
    if (product.id === "contact") {
      setIsContactModalOpen(true);
    } else {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  const handleScroll = useCallback(
    (direction: "up" | "down") => {
      if (isTransitioning) return;
      let newIndex = activeIndex;
      if (direction === "down" && activeIndex < cards.length - 1) {
        newIndex = activeIndex + 1;
      } else if (direction === "up" && activeIndex > 0) {
        newIndex = activeIndex - 1;
      }
      if (newIndex !== activeIndex) {
        setIsTransitioning(true);
        setShowScrollHint(false);
        setActiveIndex(newIndex);
      }
    },
    [activeIndex, isTransitioning]
  );

  useEffect(() => {
    let accumulatedDelta = 0;
    const threshold = 80;
    let lastScrollTime = 0;
    const scrollCooldown = 100;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning) {
        accumulatedDelta = 0;
        return;
      }
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;
      accumulatedDelta += e.deltaY;
      if (Math.abs(accumulatedDelta) > threshold) {
        lastScrollTime = now;
        if (accumulatedDelta > 0) {
          handleScroll("down");
        } else {
          handleScroll("up");
        }
        accumulatedDelta = 0;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        handleScroll("down");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handleScroll("up");
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (Math.abs(diff) > 80) {
        if (diff > 0) {
          handleScroll("down");
        } else {
          handleScroll("up");
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleScroll, isTransitioning]);

  useEffect(() => {
    const handleNavJump = ((e: CustomEvent<number>) => {
      const index = e.detail;
      if (index !== activeIndex && !isTransitioning) {
        setIsTransitioning(true);
        setActiveIndex(index);
        setShowScrollHint(false);
      }
    }) as EventListener;
    window.addEventListener("nav-jump", handleNavJump);
    return () => window.removeEventListener("nav-jump", handleNavJump);
  }, [activeIndex, isTransitioning]);

  const handleCardClick = (index: number) => {
    if (!isTransitioning && index !== activeIndex) {
      setIsTransitioning(true);
      setActiveIndex(index);
      setShowScrollHint(false);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background grid-pattern">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, var(--background) 70%)`,
        }}
      />

      <FloatingCardsScene
        cards={cards}
        activeIndex={activeIndex}
        isTransitioning={isTransitioning}
        onTransitionComplete={handleTransitionComplete}
        onCardClick={handleCardClick}
        onLearnMore={openModal}
      />

      <NavBar activeIndex={activeIndex} />
      <ScrollIndicator activeIndex={activeIndex} total={cards.length} />
      <ScrollHint visible={showScrollHint && activeIndex === 0} />
      <SectionInfo card={cards[activeIndex]} index={activeIndex} total={cards.length} />

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />

      <div
        className={cn(
          "fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-500",
          isContactModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          onClick={() => setIsContactModalOpen(false)}
        />
        <div className={cn(
          "relative w-full max-w-xl transition-all duration-500 transform",
          isContactModalOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        )}>
          <button
            onClick={() => setIsContactModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10 transition-colors z-[120]"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="border border-white/10 bg-[#071110] p-6">
            <p className="hq-dialog-kicker">Get in touch</p>
            <ContactForm />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${cards[activeIndex].color}25` }}
            >
              <div style={{ color: cards[activeIndex].color }}>
                {cards[activeIndex].icon}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {cards[activeIndex].title}
              </h3>
              <p className="text-xs" style={{ color: cards[activeIndex].color }}>
                {cards[activeIndex].subtitle}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {cards[activeIndex].description}
          </p>
        </div>
      </div>
    </main>
  );
}
