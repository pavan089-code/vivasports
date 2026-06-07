"use client";

import { useState } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardStats from "@/components/admin/DashboardStats";
import TeamManager from "@/components/admin/TeamManager";
import MatchManager from "@/components/admin/MatchManager";
import TournamentSettings from "@/components/admin/TournamentSettings";
import TeamList from "@/components/admin/TeamList";
import MatchList from "@/components/admin/MatchList";

export default function AdminPage() {
  const [activeTab, setActiveTab] =
    useState("dashboard");
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  function handleTabChange(tab) {
    setActiveTab(tab);
    setSidebarOpen(false);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050B18] lg:flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {sidebarOpen && (
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          mobile
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div className="box-border w-full min-w-0 max-w-full flex-1 px-4 py-5 sm:px-6 lg:p-10">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="
            mb-5
            inline-flex
            h-11
            items-center
            justify-center
            rounded-xl
            bg-[var(--vs-gold)]
            px-4
            text-base
            font-black
            text-[#06152F]
            lg:hidden
          "
        >
          <span className="mr-2 flex w-4 flex-col gap-1" aria-hidden="true">
            <span className="h-0.5 rounded-full bg-[#06152F]" />
            <span className="h-0.5 rounded-full bg-[#06152F]" />
            <span className="h-0.5 rounded-full bg-[#06152F]" />
          </span>
          Menu
        </button>

        <div className="w-full max-w-full space-y-6 sm:space-y-8 lg:space-y-10">
          <AdminHeader />

          {activeTab === "dashboard" && (
            <DashboardStats />
          )}

          {activeTab === "teams" && (
            <div className="space-y-8">
              <TeamManager />
              <TeamList />
            </div>
          )}

          {activeTab === "matches" && (
            <div className="space-y-8">
              <MatchManager />
              <MatchList />
            </div>
          )}

          {activeTab === "settings" && (
            <TournamentSettings />
          )}
        </div>
      </div>
    </main>
  );
}
