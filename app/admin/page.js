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

  return (
    <main className="min-h-screen bg-[#050B18] flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 p-10">
        <div className="space-y-10">
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