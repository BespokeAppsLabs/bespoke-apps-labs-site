"use client";

import React from "react";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    subtitle: string;
    description: string;
    color: string;
    icon: React.ReactNode;
    features?: string[];
  } | null;
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={cn(
          "relative w-full max-w-2xl glass border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 transform",
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        )}
      >
        {/* Header Decor */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: product.color }}
        />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full glass hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh]">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Icon & Title Area */}
            <div className="flex-shrink-0">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: `${product.color}20` }}
              >
                <div style={{ color: product.color }} className="scale-150">
                  {product.icon}
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-white mb-2">{product.title}</h2>
              <p className="text-xl font-medium mb-6" style={{ color: product.color }}>
                {product.subtitle}
              </p>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {product.description}
                {" This solution is specifically engineered to bridge the gap between complex AI capabilities and intuitive user experiences, ensuring your business stays ahead in the digital age."}
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {(product.features || [
                  "AI-Driven Optimization",
                  "Seamless Integration",
                  "Scalable Infrastructure",
                  "Premium Support"
                ]).map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  style={{ background: product.color, color: "#0a0a14" }}
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 rounded-xl font-bold glass hover:bg-white/5 transition-all flex items-center justify-center">
                  Live Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
