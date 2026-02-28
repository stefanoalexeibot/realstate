"use client";

import React from "react";
import {
    Layout, Users, Target, TrendingUp, MessageSquare,
    Settings, Plus, Eye, Share2, BarChart3,
    ArrowRight, Bell, Search
} from "lucide-react";
import type { PlanConfig } from "@/lib/config/demo-plans";
import UpgradeBanner from "./UpgradeBanner";

interface DemoAdminProps {
    plan: PlanConfig;
}

const PROPERTIES = [
    { name: "Residencia Las Misiones", price: "$12.4M", status: "Venta", owner: "Fam. García", img: "/cocina-despues.png", hits: 142 },
    { name: "Depto. Torre LOVFT", price: "$4.2M", status: "Exclusiva", owner: "Ing. Roberto M.", img: "/estancia-despues.png", hits: 89 },
    { name: "Residencia Contry Sol", price: "$8.9M", status: "Venta", owner: "Dra. Sofía L.", img: "/recamara-despues.png", hits: 56 },
    { name: "Casa Valle Poniente", price: "$6.1M", status: "Venta", owner: "Sr. Hernández", img: "/cocina-despues.png", hits: 34 },
    { name: "Pent. Santa María", price: "$15.8M", status: "Exclusiva", owner: "Lic. Pérez", img: "/estancia-despues.png", hits: 201 },
];

export default function DemoAdmin({ plan }: DemoAdminProps) {
    const f = plan.features.admin;
    const maxProps = plan.maxProperties === -1 ? PROPERTIES.length : plan.maxProperties;
    const visibleProps = PROPERTIES.slice(0, maxProps);

    const navItems = [
        { icon: Layout, label: "Propiedades", active: true, always: true },
        { icon: Users, label: "Clientes", active: false, always: true },
        { icon: Target, label: "Visitas", active: false, always: false, requires: f.visits },
        { icon: TrendingUp, label: "Analíticos", active: false, always: false, requires: f.analytics },
        { icon: MessageSquare, label: "Mensajes", active: false, always: false, requires: f.messages, badge: "3" },
        { icon: Settings, label: "Config", active: false, always: true },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white">
            <div className="flex">
                {/* Sidebar */}
                <div className="hidden lg:flex flex-col w-56 min-h-screen border-r border-white/5 bg-black/40 p-5">
                    <div className="flex items-center gap-2.5 mb-10">
                        <div className="h-8 w-8 rounded-lg bg-cima-gold flex items-center justify-center shadow-lg shadow-cima-gold/20">
                            <Layout className="h-4 w-4 text-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider text-white">Panel</span>
                            <span className="text-[8px] font-mono text-cima-gold uppercase tracking-widest">{plan.name}</span>
                        </div>
                    </div>

                    <nav className="space-y-1.5 flex-1">
                        {navItems.map((item, i) => {
                            const isLocked = !item.always && !item.requires;
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${item.active
                                            ? "bg-cima-gold/10 text-cima-gold border border-cima-gold/20"
                                            : isLocked
                                                ? "text-white/10 cursor-not-allowed"
                                                : "text-white/30 hover:bg-white/[0.03] hover:text-white/60 cursor-pointer"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon className="h-3.5 w-3.5 shrink-0" />
                                        <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
                                    </div>
                                    {item.badge && !isLocked && (
                                        <span className="h-4 w-4 rounded-full bg-cima-gold text-black text-[7px] font-black flex items-center justify-center">{item.badge}</span>
                                    )}
                                    {isLocked && (
                                        <span className="text-[7px] text-white/10 font-bold">PRO</span>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Capacity */}
                    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                        <p className="text-[7px] text-cima-gold font-black mb-2 uppercase tracking-widest">Capacidad</p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full mb-2">
                            <div className="h-full bg-cima-gold rounded-full shadow-[0_0_8px_rgba(200,169,110,0.4)]" style={{ width: `${(maxProps / 5) * 100}%` }} />
                        </div>
                        <p className="text-[7px] text-white/40 font-mono">{maxProps}/{plan.maxProperties === -1 ? "∞" : plan.maxProperties}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-xl font-heading font-black tracking-tight mb-1">Mis Propiedades</h1>
                            <p className="text-xs text-white/40">
                                Gestionando <span className="text-white font-bold">{visibleProps.length} activos</span>
                                {plan.maxProperties !== -1 && <span className="text-white/20"> (límite: {plan.maxProperties})</span>}
                            </p>
                        </div>
                        <button className="flex items-center gap-2 bg-cima-gold text-black px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shrink-0">
                            <Plus className="h-3.5 w-3.5" /> Nueva
                        </button>
                    </div>

                    {/* Analytics Row - Pro/Premium only */}
                    {f.analytics ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                            {[
                                { label: "Vistas Totales", value: "1,247", change: "+12%", icon: Eye },
                                { label: "Leads Activos", value: "23", change: "+5", icon: Users },
                                { label: "Visitas Mes", value: "18", change: "+3", icon: Target },
                                { label: "Conversión", value: "4.2%", change: "+0.8%", icon: TrendingUp },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <stat.icon className="h-3.5 w-3.5 text-white/20" />
                                        <span className="text-[8px] font-bold text-green-500">{stat.change}</span>
                                    </div>
                                    <p className="text-lg font-heading font-bold text-white">{stat.value}</p>
                                    <p className="text-[8px] text-white/30 uppercase font-bold tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mb-8">
                            <UpgradeBanner currentTier={plan.tier} requiredTier="profesional" featureName="Analíticos en Tiempo Real" />
                        </div>
                    )}

                    {/* Property Cards */}
                    <div className="space-y-3">
                        {visibleProps.map((prop, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/5 p-3 rounded-xl hover:border-cima-gold/30 hover:bg-white/[0.05] transition-all group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-14 bg-black border border-white/10 rounded-lg overflow-hidden shrink-0">
                                        <img src={prop.img} alt={prop.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <p className="text-[11px] font-bold text-white group-hover:text-cima-gold transition-colors truncate">{prop.name}</p>
                                            <span className="px-1 py-px rounded bg-cima-gold/10 border border-cima-gold/20 text-[6px] font-black text-cima-gold uppercase shrink-0">{prop.status}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[9px] font-mono">
                                            <span className="text-white/60 font-bold">{prop.price}</span>
                                            <span className="text-white/30">•</span>
                                            <span className="text-white/30">{prop.hits} vistas</span>
                                            <span className="text-white/30">•</span>
                                            <span className="text-white/40">{prop.owner}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-white/5">
                                    <div className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-cima-gold/20 transition-all cursor-pointer">
                                        <Settings className="h-3 w-3 text-white/40" />
                                    </div>
                                    <div className="p-1.5 bg-cima-gold/10 border border-cima-gold/20 rounded-lg hover:bg-cima-gold transition-all cursor-pointer">
                                        <Layout className="h-3 w-3 text-cima-gold" />
                                    </div>
                                    <div className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                                        <Share2 className="h-3 w-3 text-white/20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Property CTA / Limit reached */}
                    {plan.maxProperties !== -1 && visibleProps.length >= plan.maxProperties && (
                        <div className="mt-6 p-5 border-2 border-dashed border-cima-gold/20 rounded-2xl text-center bg-cima-gold/[0.02]">
                            <p className="text-[10px] text-cima-gold uppercase font-black tracking-widest mb-2">Límite Alcanzado</p>
                            <p className="text-xs text-white/40 mb-4">Actualiza tu plan para gestionar más propiedades</p>
                            <span className="px-4 py-2 bg-cima-gold text-black rounded-xl text-[9px] font-black uppercase inline-flex items-center gap-2 cursor-pointer hover:bg-white transition-all">
                                Upgrade <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
