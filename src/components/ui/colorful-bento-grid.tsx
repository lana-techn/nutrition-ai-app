"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Gift } from 'lucide-react';
import Link from 'next/link';

export const Component = () => {
  return (
    <section id='free-tools' className='bg-card rounded-3xl p-4 my-16 max-w-6xl mx-auto shadow-lg border border-border/50'>
      <div className='flex flex-col md:flex-row items-end justify-between w-full'>
        <div className='flex flex-col my-12 w-full items-start justify-start gap-4'>
          
          <div className='flex flex-col md:flex-row gap-2 items-end w-full justify-between'>
            <h2 className="relative text-4xl md:text-5xl font-bold max-w-xl text-left leading-[1em] text-foreground">
              AI-Powered Features, <br/> 
              <span className="inline-flex items-center">
                <Gift className="inline-flex text-accent fill-accent/10 rotate-12 ml-2" size={40} strokeWidth={2} />
              </span> 
              designed for your health.
            </h2>
            <p className='max-w-sm font-semibold text-md text-muted-foreground'>
              Experience cutting-edge AI technology that analyzes your nutrition, creates meal plans, and provides personalized health insights. Your personal nutrition assistant, available 24/7.
            </p>
          </div>

          <div className='flex flex-row text-accent gap-6 items-start justify-center'>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <p className='text-base whitespace-nowrap font-medium'>10K+ Active Users</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <p className='text-base whitespace-nowrap font-medium'>98% Accuracy Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:items-start md:justify-start gap-4">
        
        <Link 
          href={"/analyze"} 
          className="md:col-span-2 overflow-hidden hover:scale-[1.01] hover:shadow-[-6px_6px_32px_8px_rgba(192,192,192,0.2)] dark:hover:shadow-[-6px_6px_32px_8px_rgba(0,0,0,0.3)] hover:rotate-1 transition-all duration-200 ease-in-out h-[330px] relative rounded-xl flex flex-row items-center gap-8 justify-between px-6 pt-6 pb-6 group bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 border border-accent/20"
        >
          <div className='relative flex flex-col items-start justify-center gap-2'>
            <p className='-rotate-1 mb-1 text-foreground/70 font-medium'>500K+ foods analyzed</p>
            <h3 className='-rotate-1 text-2xl whitespace-nowrap font-semibold text-center px-6 py-3 bg-foreground text-background rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300'>
              AI Food Analysis
            </h3>
          </div>
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-white/20 to-transparent border border-white/30">
            <div className="w-full h-full rounded-xl bg-gradient-to-tr from-accent/5 to-accent/20"></div>
          </div>
        </Link>

        <Link 
          href={"/chat"} 
          className="overflow-hidden md:hover:scale-105 hover:shadow-[-6px_6px_32px_8px_rgba(192,192,192,0.2)] dark:hover:shadow-[-6px_6px_32px_8px_rgba(0,0,0,0.3)] hover:rotate-3 transition-all duration-200 ease-in-out relative h-[330px] rounded-xl flex flex-col items-center justify-between px-6 py-6 group bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-blue-300/5 border border-blue-400/20"
        >
          <div className='flex flex-col items-center justify-center gap-2'>
            <p className='rotate-6 mb-1 text-foreground/70 font-medium'>Available 24/7</p>
            <h3 className='rotate-6 text-2xl font-semibold text-center px-6 py-3 bg-foreground text-background rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300'>
              AI Nutritionist
            </h3>
          </div>

          <div className="w-full h-32 rounded-xl bg-gradient-to-br from-white/20 to-transparent border border-white/30 dark:from-black/20 dark:border-gray-600">
            <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-500/5 to-blue-400/20"></div>
          </div>
        </Link>

        <Link 
          href={"/meal-planner"} 
          className="overflow-hidden md:hover:scale-105 hover:shadow-[-6px_6px_32px_8px_rgba(192,192,192,0.2)] dark:hover:shadow-[-6px_6px_32px_8px_rgba(0,0,0,0.3)] hover:-rotate-3 transition-all duration-200 ease-in-out relative h-[330px] rounded-xl flex flex-col items-center justify-between px-6 py-6 group bg-gradient-to-br from-yellow-400/20 via-yellow-300/10 to-yellow-200/5 border border-yellow-400/20"
        >
          <div className='flex flex-col items-center justify-center gap-2'>
            <p className='-rotate-3 mb-1 text-foreground/70 font-medium'>Personalized meal plans</p>
            <h3 className='-rotate-3 text-2xl font-semibold text-center px-6 py-3 bg-foreground text-background rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300'>
              Smart Planning
            </h3>
          </div>
          
          <div className="w-full h-32 rounded-xl bg-gradient-to-br from-white/20 to-transparent border border-white/30 dark:from-black/20 dark:border-gray-600">
            <div className="w-full h-full rounded-xl bg-gradient-to-tr from-yellow-400/5 to-yellow-300/20"></div>
          </div>
        </Link>

        <Link 
          href={"/recipes"} 
          className="overflow-hidden md:hover:scale-105 hover:shadow-[-6px_6px_32px_8px_rgba(192,192,192,0.2)] dark:hover:shadow-[-6px_6px_32px_8px_rgba(0,0,0,0.3)] hover:rotate-4 transition-all duration-200 ease-in-out relative bg-gradient-to-br from-green-500/20 via-green-400/10 to-green-300/5 h-[330px] rounded-xl flex flex-col items-center justify-center px-6 py-6 group border border-green-400/20"
        >
          <div className="text-center space-y-3">
            <p className='-rotate-3 mb-1 text-foreground/70 font-medium'>Healthy recipes</p>
            <h3 className='-rotate-3 text-2xl font-semibold text-center px-6 py-3 bg-foreground text-background rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300'>
              Recipe Database
            </h3>
          </div>
        </Link>

        <Link 
          href={"/dashboard"} 
          className="flex items-center justify-center overflow-hidden md:hover:scale-105 hover:shadow-[-6px_6px_32px_8px_rgba(192,192,192,0.2)] dark:hover:shadow-[-6px_6px_32px_8px_rgba(0,0,0,0.3)] hover:-rotate-6 transition-all duration-200 ease-in-out relative h-[330px] rounded-xl flex flex-col items-center justify-center px-6 py-6 group bg-gradient-to-br from-pink-500/20 via-pink-400/10 to-pink-300/5 border border-pink-400/20"
        >
          <div className="text-center space-y-3">
            <p className='rotate-6 mb-1 text-foreground/70 font-medium'>Track your progress</p>
            <h3 className='rotate-6 text-2xl font-semibold text-center px-6 py-3 bg-foreground text-background rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300'>
              Health Dashboard
            </h3>
          </div>
        </Link>
      </div>
    </section>
  );
};