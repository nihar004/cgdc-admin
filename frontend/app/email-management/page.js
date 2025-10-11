"use client";

import { useState } from "react";
import { Send, Mail, Users, ArrowLeft } from "lucide-react";
import ComposeEmail from "./ComposeEmail";
import Templates from "./Templates";
import History from "./History";
import { EmailProvider } from "../../context/EmailContext";

const EmailPage = () => {
  const [activeTab, setActiveTab] = useState("compose");

  const tabs = [
    { id: "compose", label: "Compose Email", icon: Send },
    { id: "templates", label: "Templates", icon: Mail },
    { id: "history", label: "History", icon: Users },
  ];

  return (
    <EmailProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Email Manager
                  </h1>
                  <p className="text-gray-600">
                    Create, manage, and send official placement communications
                    using templates
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-slate-50 to-slate-100 text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {activeTab === "compose" && <ComposeEmail />}
            {activeTab === "templates" && <Templates />}
            {activeTab === "history" && <History />}
          </div>
        </div>
      </div>
    </EmailProvider>
  );
};

export default EmailPage;
