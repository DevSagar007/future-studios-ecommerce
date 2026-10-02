"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, UserRound, X, Package, Headphones } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { Badge } from "@/components/ui/badge";

export function StoreHeader() {
  const [open, setOpen] = useState(false); const [term, setTerm] = useState(""); const router = useRouter();
  const count = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  function search(event: React.FormEvent) { event.preventDefault(); router.push(`/products?search=${encodeURIComponent(term)}`); }
  return <>
    <div className="h-[34px] bg-[#00b795] px-4 py-[9px] text-center text-xs text-white"><Link href="/products" className="underline underline-offset-2">Super offers up to 50% off&nbsp;&nbsp; Shop Now</Link></div>
    <div className="bg-[#0f172a] px-0 py-5 max-[800px]:py-3.5"><div className="mx-auto flex w-[min(1270px,calc(100%-32px))] items-center justify-between gap-5 max-[800px]:flex-wrap">
      <Link href="/" className="flex min-w-[180px] max-[800px]:min-w-0"><Image src="/assets/logo/footer-logo.png" alt="Falcon" width={180} height={44} priority className="h-auto object-contain max-[800px]:w-[135px]"/></Link>
      <form className="relative mx-auto flex w-[min(762px,58vw)] max-[800px]:order-3 max-[800px]:w-full" onSubmit={search} role="search"><label htmlFor="header-search" className="sr-only">Search products</label><input id="header-search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search for anything...." className="h-12 w-full rounded-lg border-0 bg-white px-4 pr-14 text-[#0f172a] outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#00b795]"/><button aria-label="Search" className="absolute right-0 top-0 grid h-12 w-12 place-items-center rounded-r-lg bg-[#00b795] text-white transition-colors hover:bg-[#009c80]"><Search size={21}/></button></form>
      <div className="flex items-center gap-3.5 text-white"><Link href="/cart" className="relative flex items-center p-2" aria-label={`Cart, ${count} items`}><ShoppingCart size={24} width={24} height={24} strokeWidth={2}/><Badge className="absolute -right-0.5 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 p-0 text-[11px] text-white">{count || 0}</Badge></Link><button aria-label="Account" className="p-2"><UserRound size={24} width={24} height={24} strokeWidth={2}/></button></div>
    </div></div>
    <header className="relative bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4 max-[1200px]:gap-2 max-[800px]:items-start">
          <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3 max-[1200px]:gap-x-3">
            <div className="flex shrink-0 items-center space-x-2">
              <button type="button" className="flex items-center justify-center" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} aria-controls="categories-nav">
                {open ? <X size={24} strokeWidth={1.5} className="text-[#00a788]" /> : <Menu size={24} strokeWidth={1.5} className="text-[#00a788]" />}
              </button>
              <span className="whitespace-nowrap text-lg font-medium text-[#0f172a] max-[1200px]:text-base">Categories</span>
            </div>
            <nav id="categories-nav" aria-label="Categories" className={`${open ? "flex" : "hidden"} absolute left-4 right-4 top-full z-10 max-h-[calc(100vh-120px)] overflow-y-auto flex-col gap-4 bg-white p-[18px] shadow-[0_8px_25px_rgba(15,23,42,.13)] min-[801px]:static min-[801px]:max-h-none min-[801px]:overflow-visible min-[801px]:flex min-[801px]:flex-row min-[801px]:flex-wrap min-[801px]:gap-8 max-[1200px]:gap-3 min-[801px]:bg-transparent min-[801px]:p-0 min-[801px]:shadow-none`}>
              <Link href="/products?category=Electronics" onClick={() => setOpen(false)} className="whitespace-nowrap text-base text-gray-700 hover:text-[#00b795]">Electronics</Link>
              <Link href="/products?category=Home%20Appliances" onClick={() => setOpen(false)} className="whitespace-nowrap text-base text-gray-700 hover:text-[#00b795]">Home Appliances</Link>
              <Link href="/products?category=Mother%20%26%20Baby" onClick={() => setOpen(false)} className="whitespace-nowrap text-base text-gray-700 hover:text-[#00b795]">Mother &amp; Baby</Link>
              <Link href="/products?category=Automotive" onClick={() => setOpen(false)} className="whitespace-nowrap text-base text-gray-700 hover:text-[#00b795]">Automotive</Link>
              <Link href="/products?category=Lifestyle" onClick={() => setOpen(false)} className="whitespace-nowrap text-base text-gray-700 hover:text-[#00b795]">Sports Gear</Link>
            </nav>
          </div>
          <div className="ml-auto flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm max-[1200px]:gap-x-2 max-[1200px]:text-xs">
            <Link href="/products" className="flex items-center space-x-2 whitespace-nowrap font-medium text-[#475569] hover:text-[#00b795] max-[1200px]:space-x-1.5"><Package size={16} strokeWidth={1.5} /> <span>TRACK ORDER</span></Link>
            <Link href="/products" className="flex items-center space-x-2 whitespace-nowrap font-medium text-[#475569] hover:text-[#00b795] max-[1200px]:space-x-1.5"><Headphones size={16} strokeWidth={1.5} /> <span>HELP CENTER</span></Link>
            <Link href="/products" className="flex items-center space-x-2 whitespace-nowrap font-medium text-[#475569] hover:text-[#00b795] max-[1200px]:space-x-1.5"><Image src="/assets/icons/animation.png" alt="" width={16} height={16} aria-hidden="true" /> <span>SELL WITH US</span></Link>
          </div>
        </div>
      </div>
    </header>
  </>;
}
