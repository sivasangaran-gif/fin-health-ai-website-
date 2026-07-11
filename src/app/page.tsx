"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  CreditCard,
  Calendar,
  Search,
  Bell,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Download,
  Target,
  PieChart as PieIcon,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Filter,
  CheckCircle,
  ChevronRight,
  Info,
  AlertTriangle,
  Mic,
  Send,
  ChevronDown,
  Check,
  FileText,
  X,
  ChevronLeft,
  Activity,
  Layers,
  HelpCircle,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

// --- MOCK DATA DEFINITIONS ---

const INITIAL_TRANSACTIONS = [
  { id: "tx-1", date: "2026-07-09", description: "Grocery Shopping", category: "Food", type: "expense", amount: 2450 },
  { id: "tx-2", date: "2026-07-08", description: "Salary Credit", category: "Salary", type: "income", amount: 125000 },
  { id: "tx-3", date: "2026-07-05", description: "Electricity Bill", category: "Housing", type: "expense", amount: 1850 },
  { id: "tx-4", date: "2026-07-04", description: "Uber Ride", category: "Transport", type: "expense", amount: 320 },
  { id: "tx-5", date: "2026-07-02", description: "Freelance Work", category: "Salary", type: "income", amount: 15000 },
  { id: "tx-6", date: "2026-06-30", description: "Restaurant Dinner", category: "Food", type: "expense", amount: 1650 },
  { id: "tx-7", date: "2026-06-28", description: "Fuel Refill", category: "Transport", type: "expense", amount: 1200 },
  { id: "tx-8", date: "2026-06-25", description: "Clothing Shopping", category: "Shopping", type: "expense", amount: 5400 },
  { id: "tx-9", date: "2026-06-24", description: "Cloud Subscription", category: "Others", type: "expense", amount: 799 },
  { id: "tx-10", date: "2026-06-20", description: "Gym Membership", category: "Others", type: "expense", amount: 2000 }
];

const INITIAL_GOALS = [
  { id: "g-1", name: "Emergency Fund", target: 100000, current: 60000, date: "2026-12-31", category: "Savings", icon: "ShieldCheck", status: "In Progress" },
  { id: "g-2", name: "Trip to Europe", target: 150000, current: 45000, date: "2027-05-15", category: "Travel", icon: "Globe", status: "In Progress" },
  { id: "g-3", name: "New Car", target: 500000, current: 120000, date: "2028-06-30", category: "Asset", icon: "CreditCard", status: "In Progress" },
  { id: "g-4", name: "New Laptop", target: 120000, current: 120000, date: "2026-08-15", category: "Electronics", icon: "Zap", status: "Completed" }
];

const INITIAL_BUDGETS = [
  { category: "Housing", limit: 30000, spent: 28000 },
  { category: "Food", limit: 20000, spent: 17580 },
  { category: "Transport", limit: 15000, spent: 11230 },
  { category: "Shopping", limit: 10000, spent: 7485 },
  { category: "Entertainment", limit: 8000, spent: 5990 },
  { category: "Others", limit: 12000, spent: 8565 }
];

const INCOME_EXPENSE_DATA = [
  { name: "Dec", Income: 110000, Expenses: 68000 },
  { name: "Jan", Income: 115000, Expenses: 72000 },
  { name: "Feb", Income: 120000, Expenses: 71000 },
  { name: "Mar", Income: 118000, Expenses: 75000 },
  { name: "Apr", Income: 125000, Expenses: 79000 },
  { name: "May", Income: 125000, Expenses: 74850 }
];

const PIE_COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#6B7280"];

const CHAT_QUESTIONS = [
  { text: "How can I improve my savings rate?", id: "q-1" },
  { text: "Am I on track for my Europe Trip goal?", id: "q-2" },
  { text: "Analyze my entertainment budget", id: "q-3" },
  { text: "What is my largest expense category?", id: "q-4" }
];

export default function App() {
  const [mounted, setMounted] = useState(false);
  
  // Navigation State
  // 'landing' -> Landing Page (Dark)
  // 'dashboard' -> App (Light Layout containing the pages below)
  const [currentView, setCurrentView] = useState<
    "landing" | "dashboard" | "transactions" | "budget" | "goals" | "ai" | "reports" | "settings"
  >("landing");

  // Global Settings State
  const [userName, setUserName] = useState("Rahul Verma");
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [notifications, setNotifications] = useState<string[]>([
    "Your savings rate went up by 1.5% compared to last month!",
    "Alert: Food budget is approaching its set limit (87% spent).",
    "Goal Milestones: Emergency Fund reached 60% completion."
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // App States (Synced across screens)
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
  
  // AI assistant chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your FinHealth AI assistant. I have analyzed your income, expenses, and goals. Ask me anything about your finances!",
      time: "20:50"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // New Transaction Form State
  const [showAddTx, setShowAddTx] = useState(false);
  const [newTx, setNewTx] = useState({ description: "", amount: "", type: "expense", category: "Food", date: new Date().toISOString().split("T")[0] });

  // New Goal Form State
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: "", current: "", date: "", category: "Savings" });

  // Onboarding Gating States
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [onboardForm, setOnboardForm] = useState({
    fullName: "",
    email: "",
    password: "",
    currency: "₹",
    monthlyIncome: "",
    monthlyExpenses: "",
    netWorth: ""
  });
  const [baseNetWorth, setBaseNetWorth] = useState(845000);

  // Pricing & Contact Modal States
  const [showPricing, setShowPricing] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state data derived values
  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const currentSavingsRate = useMemo(() => {
    if (totalIncome === 0) return 0;
    return Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100));
  }, [totalIncome, totalExpense]);

  const netWorth = useMemo(() => {
    return baseNetWorth + (totalIncome - totalExpense);
  }, [baseNetWorth, totalIncome, totalExpense]);

  // Dynamic Financial Health Score Formula
  const financialHealthScore = useMemo(() => {
    if (totalIncome === 0) return 0;
    const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
    const debtToIncomePenalty = (totalExpense / totalIncome) * 50;
    const rawScore = 100 - debtToIncomePenalty + (savingsRate * 0.5);
    return Math.max(0, Math.min(100, Math.round(rawScore)));
  }, [totalIncome, totalExpense]);

  const scoreBadge = useMemo(() => {
    if (financialHealthScore >= 80) {
      return { text: "Excellent", color: "#10B981", bg: "bg-emerald-accent/10 text-emerald-accent border-emerald-accent/20" };
    } else if (financialHealthScore >= 50) {
      return { text: "Stable", color: "#F59E0B", bg: "bg-amber-500/10 text-[#F59E0B] border-[#F59E0B]/20" };
    } else {
      return { text: "Critical Warning", color: "#EF4444", bg: "bg-red-500/10 text-coral-accent border-coral-accent/20" };
    }
  }, [financialHealthScore]);

  // Step 1 Validation
  const isStep1Valid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      onboardForm.fullName.trim() !== "" &&
      emailRegex.test(onboardForm.email) &&
      onboardForm.password.length >= 6
    );
  }, [onboardForm.fullName, onboardForm.email, onboardForm.password]);

  // Step 2 Validation
  const isStep2Valid = useMemo(() => {
    const incomeNum = parseFloat(onboardForm.monthlyIncome);
    const expenseNum = parseFloat(onboardForm.monthlyExpenses);
    const netWorthNum = parseFloat(onboardForm.netWorth);
    return (
      !isNaN(incomeNum) && incomeNum > 0 &&
      !isNaN(expenseNum) && expenseNum >= 0 &&
      !isNaN(netWorthNum) && netWorthNum >= 0
    );
  }, [onboardForm.monthlyIncome, onboardForm.monthlyExpenses, onboardForm.netWorth]);

  // Onboarding Submit Handler
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid || !isStep2Valid) return;

    const parsedIncome = parseFloat(onboardForm.monthlyIncome);
    const parsedExpenses = parseFloat(onboardForm.monthlyExpenses);
    const parsedNetWorth = parseFloat(onboardForm.netWorth);

    setUserName(onboardForm.fullName);
    setCurrencySymbol(onboardForm.currency);

    const newTransactions = [
      { id: "tx-onboard-1", date: new Date().toISOString().split("T")[0], description: "Monthly Salary (Onboard)", category: "Salary", type: "income" as const, amount: parsedIncome },
      { id: "tx-onboard-2", date: new Date().toISOString().split("T")[0], description: "Fixed Expenses (Onboard)", category: "Housing", type: "expense" as const, amount: parsedExpenses }
    ];
    setTransactions(newTransactions);

    setBudgets([
      { category: "Housing", limit: Math.round(parsedExpenses * 1.2), spent: Math.round(parsedExpenses * 0.4) },
      { category: "Food", limit: Math.round(parsedIncome * 0.2), spent: Math.round(parsedExpenses * 0.25) },
      { category: "Transport", limit: Math.round(parsedIncome * 0.1), spent: Math.round(parsedExpenses * 0.15) },
      { category: "Shopping", limit: Math.round(parsedIncome * 0.15), spent: Math.round(parsedExpenses * 0.1) },
      { category: "Entertainment", limit: Math.round(parsedIncome * 0.08), spent: Math.round(parsedExpenses * 0.08) },
      { category: "Others", limit: Math.round(parsedIncome * 0.1), spent: Math.round(parsedExpenses * 0.02) }
    ]);

    setBaseNetWorth(parsedNetWorth - (parsedIncome - parsedExpenses));

    setGoals([
      { id: "g-1", name: "Emergency Fund", target: Math.round(parsedExpenses * 6), current: Math.round(parsedNetWorth * 0.3), date: "2026-12-31", category: "Savings", icon: "ShieldCheck", status: "In Progress" },
      { id: "g-2", name: "Trip to Europe", target: Math.round(parsedIncome * 1.5), current: Math.round(parsedNetWorth * 0.1), date: "2027-05-15", category: "Travel", icon: "Globe", status: "In Progress" },
      { id: "g-3", name: "Investment Portfolio", target: Math.round(parsedNetWorth * 2), current: Math.round(parsedNetWorth * 0.5), date: "2028-06-30", category: "Asset", icon: "CreditCard", status: "In Progress" }
    ]);

    setShowOnboarding(false);
    setCurrentView("dashboard");

    setNotifications([
      "Welcome to FinHealth! Your baseline metrics have been generated.",
      `Identity verified for ${onboardForm.fullName} (${onboardForm.email}).`,
      ...notifications
    ]);
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentView("landing");
    setUserName("Rahul Verma");
    setCurrencySymbol("₹");
    setTransactions(INITIAL_TRANSACTIONS);
    setGoals(INITIAL_GOALS);
    setBudgets(INITIAL_BUDGETS);
    setBaseNetWorth(845000);
    setOnboardForm({
      fullName: "",
      email: "",
      password: "",
      currency: "₹",
      monthlyIncome: "",
      monthlyExpenses: "",
      netWorth: ""
    });
    setOnboardingStep(1);
    setShowOnboarding(false);
  };

  // Handle adding new transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;

    const amountNum = parseFloat(newTx.amount);
    const addedTx = {
      id: `tx-${Date.now()}`,
      date: newTx.date,
      description: newTx.description,
      category: newTx.category,
      type: newTx.type as "income" | "expense",
      amount: amountNum
    };

    setTransactions([addedTx, ...transactions]);

    // Update corresponding budgets
    if (newTx.type === "expense") {
      setBudgets(prev =>
        prev.map(b =>
          b.category.toLowerCase() === newTx.category.toLowerCase()
            ? { ...b, spent: b.spent + amountNum }
            : b
        )
      );
    }

    // Reset form
    setNewTx({ description: "", amount: "", type: "expense", category: "Food", date: new Date().toISOString().split("T")[0] });
    setShowAddTx(false);
    
    // Add Notification
    setNotifications([
      `Transaction added: ${addedTx.description} (${currencySymbol}${addedTx.amount})`,
      ...notifications
    ]);
  };

  // Handle adding new goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    const targetNum = parseFloat(newGoal.target);
    const currentNum = parseFloat(newGoal.current || "0");
    const addedGoal = {
      id: `g-${Date.now()}`,
      name: newGoal.name,
      target: targetNum,
      current: currentNum,
      date: newGoal.date || new Date(Date.now() + 31536000000).toISOString().split("T")[0],
      category: newGoal.category,
      icon: newGoal.category === "Savings" ? "ShieldCheck" : newGoal.category === "Travel" ? "Globe" : "Zap",
      status: currentNum >= targetNum ? "Completed" : "In Progress"
    };

    setGoals([...goals, addedGoal]);
    setNewGoal({ name: "", target: "", current: "", date: "", category: "Savings" });
    setShowAddGoal(false);
    setNotifications([
      `New Financial Goal created: "${addedGoal.name}"`,
      ...notifications
    ]);
  };

  // Adjust Budget limit slider
  const handleBudgetLimitChange = (category: string, newLimit: number) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit: newLimit } : b));
  };

  // Trigger Mock AI response
  const triggerAIResponse = (userText: string) => {
    setIsTyping(true);
    let reply = "";
    const lower = userText.toLowerCase();

    if (lower.includes("saving") || lower.includes("improve")) {
      reply = `Based on your monthly transaction ledger, you could increase your savings rate from ${currentSavingsRate}% to 33% by making two adjustments:\n1. Limit dining out and delivery expenses (currently ${currencySymbol}17,580 this month).\n2. Automate a transfer of ${currencySymbol}15,000 to your Emergency Fund goal right after your salary credit on the 1st.`;
    } else if (lower.includes("europe") || lower.includes("trip")) {
      const europeGoal = goals.find(g => g.name.toLowerCase().includes("europe"));
      if (europeGoal) {
        const percent = Math.round((europeGoal.current / europeGoal.target) * 100);
        reply = `You have saved ${currencySymbol}${europeGoal.current.toLocaleString()} out of ${currencySymbol}${europeGoal.target.toLocaleString()} (${percent}%) for the "${europeGoal.name}". To reach this by ${europeGoal.date}, you need to save approximately ${currencySymbol}${Math.round((europeGoal.target - europeGoal.current) / 10).toLocaleString()} per month. You are currently slightly behind schedule.`;
      } else {
        reply = "I couldn't find a 'Trip to Europe' goal in your list. Would you like me to help you set one up?";
      }
    } else if (lower.includes("budget") || lower.includes("entertainment")) {
      const entBudget = budgets.find(b => b.category === "Entertainment");
      if (entBudget) {
        reply = `Your Entertainment budget is currently at ${Math.round((entBudget.spent / entBudget.limit) * 100)}% of its limit (${currencySymbol}${entBudget.spent}/${currencySymbol}${entBudget.limit}). You have ${currencySymbol}${entBudget.limit - entBudget.spent} remaining for the month. I recommend holding off on luxury subscriptions to stay within budget.`;
      } else {
        reply = "Your budget analysis shows stable spending. Housing and Food remain your largest expense groups.";
      }
    } else if (lower.includes("largest") || lower.includes("expense") || lower.includes("category")) {
      const sorted = [...budgets].sort((a, b) => b.spent - a.spent);
      reply = `Your largest expense category is **${sorted[0].category}** with a total spend of ${currencySymbol}${sorted[0].spent.toLocaleString()} (representing ${Math.round((sorted[0].spent / totalExpense) * 100)}% of your expenses), followed closely by **${sorted[1].category}** at ${currencySymbol}${sorted[1].spent.toLocaleString()}.`;
    } else {
      reply = `I've analyzed your financial layout. You've recorded an income of ${currencySymbol}${totalIncome.toLocaleString()} and expenses of ${currencySymbol}${totalExpense.toLocaleString()} this month, resulting in a Net Worth of ${currencySymbol}${netWorth.toLocaleString()}. Let me know if you would like custom advice on investments, savings milestones, or budget controls!`;
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: "ai",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: "user", text, time: timeStr }]);
    setChatInput("");
    triggerAIResponse(text);
  };

  // Helpers for Icons mapping
  const getGoalIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck": return <ShieldCheck className="h-5 w-5 text-emerald-accent" />;
      case "Globe": return <Globe className="h-5 w-5 text-royal-accent" />;
      case "Zap": return <Zap className="h-5 w-5 text-purple-500" />;
      default: return <Target className="h-5 w-5 text-blue-500" />;
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col font-sans select-none antialiased">
      <AnimatePresence mode="wait">
        
        {/* ==================== SCREEN A: LANDING PAGE (Dark Theme) ==================== */}
        {currentView === "landing" && (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#0B0F19] text-white flex flex-col overflow-hidden relative"
          >
            {/* Glowing background gradient mesh */}
            <div className="absolute top-[-300px] left-[-200px] w-[600px] h-[600px] rounded-full bg-emerald-accent/10 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-200px] right-[-100px] w-[700px] h-[700px] rounded-full bg-royal-accent/10 blur-[180px] pointer-events-none" />

            {/* Navbar */}
            <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/[0.05] z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-accent to-royal-accent flex items-center justify-center font-bold text-black tracking-tighter text-lg shadow-lg shadow-emerald-500/20">
                  FH
                </div>
                <span className="font-semibold tracking-tight text-xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  FinHealth
                </span>
              </div>
              
              <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
                <a href="#features" className="hover:text-white transition-colors font-medium">Features</a>
                <button onClick={() => setShowPricing(true)} className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 font-medium">Pricing</button>
                <button onClick={() => setShowContact(true)} className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 font-medium">Contact</button>
              </nav>

              <button
                onClick={() => { setShowOnboarding(true); setOnboardingStep(1); }}
                className="px-5 py-2.5 rounded-full bg-emerald-accent hover:bg-emerald-accent/90 text-black font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                Get Started
              </button>
            </header>

            {/* Hero Section */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col lg:flex-row items-center gap-16 z-10">
              {/* Hero Left Content */}
              <div className="flex-1 flex flex-col items-start text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-accent/10 border border-emerald-accent/20 text-emerald-accent text-xs font-semibold tracking-wide uppercase mb-6 animate-pulse-gentle">
                  <Sparkles className="h-3 w-3" />
                  AI-Powered Financial Insights
                </div>

                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-white bg-gradient-to-b from-white to-slate-200 bg-clip-text">
                  Know Your Financial Health, Build a <span className="bg-gradient-to-r from-emerald-accent to-teal-400 bg-clip-text text-transparent font-extrabold">Better Future</span>
                </h1>

                <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                  An AI-driven wellness platform that analyzes your incomes, expenses, savings, debts, and investments to generate a real-time health score and actionable recommendations.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
                  <button
                    onClick={() => { setShowOnboarding(true); setOnboardingStep(1); }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-accent text-[#0B0F19] font-bold text-base hover:bg-emerald-accent/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => { setShowOnboarding(true); setOnboardingStep(1); }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-white font-semibold text-base transition-all cursor-pointer"
                  >
                    See How It Works
                  </button>
                </div>

                {/* Social Proof */}
                <div className="flex flex-col gap-3">
                  <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">Trusted by 10,000+ users</p>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80" alt="User 1" className="w-8 h-8 rounded-full border-2 border-[#0B0F19] object-cover" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80" alt="User 2" className="w-8 h-8 rounded-full border-2 border-[#0B0F19] object-cover" />
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80" alt="User 3" className="w-8 h-8 rounded-full border-2 border-[#0B0F19] object-cover" />
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80" alt="User 4" className="w-8 h-8 rounded-full border-2 border-[#0B0F19] object-cover" />
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.05] rounded-xl px-2.5 py-1">
                      <div className="flex text-amber-400">★ ★ ★ ★ ★</div>
                      <span className="text-xs font-bold text-slate-300">4.8 (250 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Right Graphic - perspective floating dashboard */}
              <div className="flex-1 w-full flex items-center justify-center relative">
                <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-royal-accent/20 rounded-full blur-[100px] pointer-events-none" />
                <motion.div 
                  initial={{ rotateY: -15, rotateX: 10, scale: 0.95 }}
                  animate={{ rotateY: -8, rotateX: 6, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-full max-w-[520px] aspect-[4/3] glass-panel-dark p-6 rounded-[24px] shadow-2xl relative flex flex-col justify-between overflow-hidden"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Top elements */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-accent" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">FinHealth Live System</span>
                  </div>

                  {/* Mock content grid */}
                  <div className="grid grid-cols-5 gap-4 flex-1">
                    
                    {/* Health score gauge card */}
                    <div className="col-span-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                      <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">Financial Score</p>
                      
                      {/* Beautiful SVG Gauge */}
                      <div className="relative w-32 h-20 flex items-center justify-center overflow-hidden">
                        <svg className="absolute top-0 w-32 h-16" viewBox="0 0 100 50">
                          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#ffffff15" strokeWidth="8" strokeLinecap="round" />
                          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={scoreBadge.color} strokeWidth="8" strokeDasharray="126" strokeDashoffset={126 - (126 * (financialHealthScore / 100))} strokeLinecap="round" />
                        </svg>
                        <div className="absolute bottom-1 flex flex-col items-center">
                          <span className="text-3xl font-extrabold text-white tracking-tight">{financialHealthScore}</span>
                          <span className="text-[10px] font-bold" style={{ color: scoreBadge.color }}>{scoreBadge.text}</span>
                        </div>
                      </div>
                      
                      <p className="text-[10px] text-slate-500 mt-2">You are in good financial shape!</p>
                    </div>

                    {/* Historical mini chart mock */}
                    <div className="col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Score History</p>
                        <h4 className="text-sm font-bold text-white mt-1">+1.5% this mo</h4>
                      </div>
                      {/* Recharts minimal Area Chart inside graphic */}
                      <div className="h-16 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { s: 78 }, { s: 80 }, { s: 79 }, { s: 82 }, { s: 83 }, { s: 85 }
                          ]} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <defs>
                              <linearGradient id="mini-color" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="s" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#mini-color)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Values row */}
                    <div className="col-span-5 grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-2.5">
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">Monthly Income</span>
                        <p className="text-xs font-bold text-white mt-0.5">₹1,25,000</p>
                        <span className="text-[9px] text-emerald-accent font-semibold">+15%</span>
                      </div>
                      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-2.5">
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">Monthly Expenses</span>
                        <p className="text-xs font-bold text-white mt-0.5">₹74,850</p>
                        <span className="text-[9px] text-red-400 font-semibold">-8%</span>
                      </div>
                      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-2.5">
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">Savings Rate</span>
                        <p className="text-xs font-bold text-white mt-0.5">28%</p>
                        <span className="text-[9px] text-emerald-accent font-semibold">+5%</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </div>
            </main>

            {/* Features Section */}
            <section id="features" className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.05] relative">
              <div className="text-center max-w-xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Everything You Need to Improve Your Financial Health</h2>
                <p className="text-slate-400 text-sm">FinHealth analyzes and connects your budgeting, savings tracking, and goal planning in one beautiful space.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Feature 1 */}
                <div className="p-6 rounded-[22px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-emerald-accent/10 border border-emerald-accent/20 flex items-center justify-center mb-5 text-emerald-accent">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">AI Financial Score</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Get a personalized score based on your unique balance sheet variables: income, spending, and savings.</p>
                </div>

                {/* Feature 2 */}
                <div className="p-6 rounded-[22px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-royal-accent/10 border border-royal-accent/20 flex items-center justify-center mb-5 text-royal-accent">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Smart Insights</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Identify unusual expenses, track recurring subscriptions, and get actionable recommendations to save.</p>
                </div>

                {/* Feature 3 */}
                <div className="p-6 rounded-[22px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5 text-yellow-500">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Goal Planning</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Set multiple short-term and long-term goals with targeted progress and automatic milestone alerts.</p>
                </div>

                {/* Feature 4 */}
                <div className="p-6 rounded-[22px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-500">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">AI Assistant</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Chat in real-time with an intelligent assistant to get detailed responses to complex financial scenarios.</p>
                </div>

              </div>
            </section>

            {/* Landing Page Footer */}
            <footer className="w-full border-t border-white/[0.05] bg-black/40 py-12 mt-auto z-10 relative">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Logo & Copyright */}
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-accent to-royal-accent flex items-center justify-center font-bold text-black text-xs">
                      FH
                    </div>
                    <span className="font-bold text-sm tracking-tight text-white">FinHealth</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">© 2026 FinHealth Inc. All rights reserved.</span>
                </div>

                {/* Communication links */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-400 font-semibold">
                  <a href="#features" className="hover:text-white transition-colors">Features</a>
                  <button onClick={() => setShowPricing(true)} className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 font-semibold">Pricing</button>
                  <button onClick={() => setShowContact(true)} className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 font-semibold">Contact</button>
                  <a href="mailto:sivasangaran1512@gmail.com" className="hover:text-white transition-colors flex items-center gap-1">
                    sivasangaran1512@gmail.com
                  </a>
                  <a href="tel:+918056239558" className="hover:text-white transition-colors">
                    +91 8056239558
                  </a>
                </div>

                {/* Social CTAs */}
                <div className="flex items-center gap-4">
                  {/* WhatsApp Message CTA */}
                  <a
                    href="https://wa.me/918056239558?text=Hi%20Sivasangaran,%20I%20saw%20your%20FinHealth%20platform..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-accent/10 border border-emerald-accent/20 hover:bg-emerald-accent/20 text-emerald-accent font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message on WhatsApp
                  </a>
                  
                  {/* LinkedIn Professional CTA */}
                  <a
                    href="https://www.linkedin.com/in/sivasangaran-s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white hover:text-royal-accent transition-all"
                    title="Connect on LinkedIn"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                </div>

              </div>
            </footer>
          </motion.div>
        )}


        {/* ==================== CORE DASHBOARD FRAMEWORK (Light Theme) ==================== */}
        {currentView !== "landing" && (
          <motion.div
            key="dashboard-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 min-h-screen bg-[#F8FAFC] text-[#0B0F19] overflow-hidden"
          >
            
            {/* LEFT SIDEBAR (Sticky Navigation) */}
            <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between p-6 z-20 shrink-0">
              <div className="flex flex-col gap-8">
                
                {/* Brand Logo */}
                <div 
                  onClick={() => setCurrentView("landing")} 
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-accent to-royal-accent flex items-center justify-center font-bold text-black tracking-tighter text-base shadow-sm">
                    FH
                  </div>
                  <span className="font-bold tracking-tight text-lg group-hover:text-emerald-accent transition-colors">
                    FinHealth
                  </span>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                      currentView === "dashboard"
                        ? "bg-royal-accent/10 text-royal-accent"
                        : "text-[#64748B] hover:text-[#0B0F19] hover:bg-slate-50"
                    }`}
                  >
                    <Layers className="h-4.5 w-4.5" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentView("transactions")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                      currentView === "transactions"
                        ? "bg-royal-accent/10 text-royal-accent"
                        : "text-[#64748B] hover:text-[#0B0F19] hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard className="h-4.5 w-4.5" />
                    Transactions
                  </button>
                  <button
                    onClick={() => setCurrentView("budget")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                      currentView === "budget"
                        ? "bg-royal-accent/10 text-royal-accent"
                        : "text-[#64748B] hover:text-[#0B0F19] hover:bg-slate-50"
                    }`}
                  >
                    <PieIcon className="h-4.5 w-4.5" />
                    Budget Planner
                  </button>
                  <button
                    onClick={() => setCurrentView("goals")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                      currentView === "goals"
                        ? "bg-royal-accent/10 text-royal-accent"
                        : "text-[#64748B] hover:text-[#0B0F19] hover:bg-slate-50"
                    }`}
                  >
                    <Target className="h-4.5 w-4.5" />
                    Goals Tracker
                  </button>
                  <button
                    onClick={() => setCurrentView("ai")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                      currentView === "ai"
                        ? "bg-royal-accent/10 text-royal-accent"
                        : "text-[#64748B] hover:text-[#0B0F19] hover:bg-slate-50"
                    }`}
                  >
                    <Sparkles className="h-4.5 w-4.5" />
                    AI Assistant
                  </button>
                  <button
                    onClick={() => setCurrentView("reports")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                      currentView === "reports"
                        ? "bg-royal-accent/10 text-royal-accent"
                        : "text-[#64748B] hover:text-[#0B0F19] hover:bg-slate-50"
                    }`}
                  >
                    <Download className="h-4.5 w-4.5" />
                    Reports
                  </button>
                  <button
                    onClick={() => setCurrentView("settings")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                      currentView === "settings"
                        ? "bg-royal-accent/10 text-royal-accent"
                        : "text-[#64748B] hover:text-[#0B0F19] hover:bg-slate-50"
                    }`}
                  >
                    <Settings className="h-4.5 w-4.5" />
                    Settings
                  </button>
                </nav>
              </div>

              {/* Logout Link */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide text-[#64748B] hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer border-t border-slate-100 pt-5 text-left"
              >
                <LogOut className="h-4.5 w-4.5" />
                Log Out
              </button>
            </aside>


            {/* RIGHT WORKSPACE */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
              
              {/* TOP BAR */}
              <header className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-[#E2E8F0] px-8 py-4 flex items-center justify-between z-10">
                {/* Search Bar */}
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions, recommendations..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-[#0B0F19] placeholder-slate-400 focus:outline-none focus:border-royal-accent transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B0F19]">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Right Utilities */}
                <div className="flex items-center gap-6">
                  
                  {/* Date range display */}
                  <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>July 1 - July 31, 2026</span>
                  </div>

                  {/* Notification Icon */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer relative"
                    >
                      <Bell className="h-4.5 w-4.5 text-slate-600" />
                      {notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </button>
                    
                    {/* Dropdown list */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 z-50 text-left"
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                            <span className="font-bold text-sm">Notifications</span>
                            <button 
                              onClick={() => setNotifications([])}
                              className="text-xs text-royal-accent hover:underline font-semibold"
                            >
                              Clear all
                            </button>
                          </div>
                          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto no-scrollbar">
                            {notifications.length === 0 ? (
                              <p className="text-xs text-slate-400 py-3 text-center">No new notifications</p>
                            ) : (
                              notifications.map((note, i) => (
                                <div key={i} className="flex gap-2 text-xs py-1.5 border-b border-slate-50 last:border-0">
                                  <div className="w-1.5 h-1.5 rounded-full bg-royal-accent shrink-0 mt-1.5" />
                                  <p className="text-slate-600 leading-relaxed">{note}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Picker */}
                  <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80"
                      alt={userName}
                      className="w-9 h-9 rounded-xl border border-slate-200 object-cover"
                    />
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-sm font-bold text-slate-800">{userName}</span>
                      <span className="text-[10px] font-semibold text-emerald-accent">Premium Member</span>
                    </div>
                  </div>

                </div>
              </header>

              {/* VIEW SWITCHER / RENDER AREA */}
              <div className="p-8 flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  
                  {/* ==================== VIEW B: CORE DASHBOARD ==================== */}
                  {currentView === "dashboard" && (
                    <motion.div
                      key="dashboard-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex-1 flex flex-col gap-8"
                    >
                      {/* Page Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {userName.split(" ")[0]}!</h2>
                          <p className="text-xs text-slate-500">Here's your real-time financial health overview.</p>
                        </div>
                        <button
                          onClick={() => setShowAddTx(true)}
                          className="px-4.5 py-2.5 bg-royal-accent hover:bg-royal-accent/90 text-white rounded-xl font-semibold text-xs tracking-wide flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          Log Transaction
                        </button>
                      </div>

                      {/* 5 Metrics Cards Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                        
                        {/* Financial Health Score (Gauge Card) */}
                        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[20px] p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                          <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mb-2">Financial Health Score</p>
                          
                          {/* Semicircle SVG Gauge */}
                          <div className="relative w-36 h-20 flex items-center justify-center overflow-hidden">
                            <svg className="absolute top-0 w-36 h-18" viewBox="0 0 100 50">
                              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" />
                              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={scoreBadge.color} strokeWidth="8" strokeDasharray="126" strokeDashoffset={126 - (126 * (financialHealthScore / 100))} strokeLinecap="round" />
                            </svg>
                            <div className="absolute bottom-0.5 flex flex-col items-center">
                              <span className="text-3xl font-black tracking-tight text-[#0B0F19]">{financialHealthScore}</span>
                              <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${scoreBadge.bg}`}>{scoreBadge.text}</span>
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-500 mt-2 font-medium">
                            <span className="text-emerald-accent font-bold">1.5%</span> higher than last month
                          </p>
                        </div>

                        {/* Monthly Income Card */}
                        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[20px] p-5 flex flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Monthly Income</span>
                              <TrendingUp className="h-4.5 w-4.5 text-emerald-accent" />
                            </div>
                            <h3 className="text-2xl font-black text-[#0B0F19] mt-2">
                              {currencySymbol}{totalIncome.toLocaleString()}
                            </h3>
                          </div>
                          <span className="text-[10px] text-emerald-accent font-bold mt-4 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> +15% from last month
                          </span>
                        </div>

                        {/* Monthly Expenses Card */}
                        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[20px] p-5 flex flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Monthly Expenses</span>
                              <TrendingDown className="h-4.5 w-4.5 text-coral-accent" />
                            </div>
                            <h3 className="text-2xl font-black text-[#0B0F19] mt-2">
                              {currencySymbol}{totalExpense.toLocaleString()}
                            </h3>
                          </div>
                          <span className="text-[10px] text-coral-accent font-bold mt-4 flex items-center gap-1">
                            <ArrowDownRight className="h-3 w-3" /> -8% from last month
                          </span>
                        </div>

                        {/* Savings Rate Card */}
                        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[20px] p-5 flex flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Savings Rate</span>
                              <Wallet className="h-4.5 w-4.5 text-royal-accent" />
                            </div>
                            <h3 className="text-2xl font-black text-[#0B0F19] mt-2">
                              {currentSavingsRate}%
                            </h3>
                          </div>
                          <span className="text-[10px] text-emerald-accent font-bold mt-4 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> +5% from last month
                          </span>
                        </div>

                        {/* Net Worth Card */}
                        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[20px] p-5 flex flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Net Worth</span>
                              <DollarSign className="h-4.5 w-4.5 text-emerald-accent" />
                            </div>
                            <h3 className="text-2xl font-black text-[#0B0F19] mt-2">
                              {currencySymbol}{netWorth.toLocaleString()}
                            </h3>
                          </div>
                          <span className="text-[10px] text-emerald-accent font-bold mt-4 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> +18% from last year
                          </span>
                        </div>

                      </div>

                      {/* Charts Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* 6-Month Income vs Expenses Clustered Bar Chart */}
                        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] shadow-sm rounded-[24px] p-6 text-left">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">Income vs Expenses</h4>
                              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Historical Comparison</p>
                            </div>
                            <select className="border border-slate-200 bg-slate-50 text-[10px] font-bold rounded-xl px-2.5 py-1.5 text-slate-600 focus:outline-none">
                              <option>Last 6 Months</option>
                              <option>Last 12 Months</option>
                            </select>
                          </div>
                          
                          <div className="h-64 w-full text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={INCOME_EXPENSE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                                  formatter={(value) => [`${currencySymbol}${value ? Number(value).toLocaleString() : '0'}`]} 
                                />
                                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }} />
                                <Bar dataKey="Income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Expense Breakdown Doughnut Chart */}
                        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[24px] p-6 text-left flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">Expense Breakdown</h4>
                              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">This Month</p>
                            </div>
                          </div>

                          <div className="h-44 w-full relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={budgets}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={70}
                                  paddingAngle={4}
                                  dataKey="spent"
                                >
                                  {budgets.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${currencySymbol}${value ? Number(value).toLocaleString() : '0'}`]} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-[10px] text-slate-400 font-semibold">Total Spent</span>
                              <span className="text-sm font-extrabold">{currencySymbol}{totalExpense.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Inline Legend */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 pt-4 border-t border-slate-50">
                            {budgets.map((item, index) => {
                              const pct = Math.round((item.spent / totalExpense) * 100);
                              return (
                                <div key={item.category} className="flex items-center justify-between text-[10px] font-medium text-slate-600">
                                  <div className="flex items-center gap-1.5 truncate">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                    <span className="truncate">{item.category}</span>
                                  </div>
                                  <span className="font-bold text-[#0B0F19]">{pct}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Footer Row (Recent Transactions, Financial Goals, AI Recommendation) */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Column 1: Recent Transactions Mini Ledger */}
                        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[24px] p-6 text-left flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-slate-800 text-sm">Recent Transactions</h4>
                            <button
                              onClick={() => setCurrentView("transactions")}
                              className="text-xs text-royal-accent hover:underline font-bold"
                            >
                              View All
                            </button>
                          </div>

                          <div className="flex flex-col gap-3.5 flex-1 justify-start">
                            {transactions.slice(0, 4).map((tx) => (
                              <div key={tx.id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-b-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                    tx.type === "income" ? "bg-emerald-50 text-emerald-accent" : "bg-red-50 text-coral-accent"
                                  }`}>
                                    {tx.type === "income" ? <ArrowUpRight className="h-4.5 w-4.5" /> : <ArrowDownRight className="h-4.5 w-4.5" />}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-[#0B0F19]">{tx.description}</p>
                                    <span className="text-[10px] text-slate-400 font-semibold">{tx.category} • {tx.date}</span>
                                  </div>
                                </div>
                                <span className={`text-xs font-extrabold ${tx.type === "income" ? "text-emerald-accent" : "text-coral-accent"}`}>
                                  {tx.type === "income" ? "+" : "-"}{currencySymbol}{tx.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Column 2: Financial Goals Progress bars */}
                        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[24px] p-6 text-left flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-slate-800 text-sm">Financial Goals</h4>
                            <button
                              onClick={() => setCurrentView("goals")}
                              className="text-xs text-royal-accent hover:underline font-bold"
                            >
                              View All
                            </button>
                          </div>

                          <div className="flex flex-col gap-4 flex-1 justify-center">
                            {goals.slice(0, 3).map((goal) => {
                              const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                              return (
                                <div key={goal.id} className="flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-[#0B0F19]">{goal.name}</span>
                                    <span className="text-slate-500">{percent}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-emerald-accent rounded-full transition-all duration-500" 
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase">
                                    <span>Saved: {currencySymbol}{goal.current.toLocaleString()}</span>
                                    <span>Target: {currencySymbol}{goal.target.toLocaleString()}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Column 3: AI Recommendation Card */}
                        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[24px] p-6 text-left flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-royal-accent/5 rounded-full blur-xl pointer-events-none" />
                          
                          <div>
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-royal-accent/10 border border-royal-accent/20 text-royal-accent text-[9px] font-bold uppercase tracking-wider mb-3">
                              <Sparkles className="h-3 w-3" />
                              AI Insights
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-2">Smart Savings Advice</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              Based on your spending patterns, you can save {currencySymbol}12,500 more per month by reducing dining out and entertainment subscriptions.
                            </p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Est. Growth: +3.4%</span>
                            <button
                              onClick={() => {
                                setCurrentView("ai");
                                handleSendChat("How can I improve my savings rate?");
                              }}
                              className="px-3.5 py-2 bg-royal-accent hover:bg-royal-accent/90 text-white rounded-xl font-bold text-[10px] transition-all cursor-pointer"
                            >
                              Ask Assistant
                            </button>
                          </div>
                        </div>

                      </div>

                    </motion.div>
                  )}


                  {/* ==================== VIEW C: TRANSACTIONS PAGE ==================== */}
                  {currentView === "transactions" && (
                    <motion.div
                      key="transactions-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex-1 flex flex-col gap-6 text-left"
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">Transactions Ledger</h2>
                          <p className="text-xs text-slate-500">View, search, and audit your financial logs.</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              // Trigger a mock CSV download
                              const headers = "Date,Description,Category,Type,Amount\n";
                              const rows = transactions.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`).join("\n");
                              const blob = new Blob([headers + rows], { type: "text/csv" });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.setAttribute("href", url);
                              a.setAttribute("download", `finhealth_transactions_${Date.now()}.csv`);
                              a.click();
                              setNotifications(["Transactions exported to CSV successfully.", ...notifications]);
                            }}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold text-xs tracking-wide flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <Download className="h-4 w-4" />
                            Export CSV
                          </button>
                          <button
                            onClick={() => setShowAddTx(true)}
                            className="px-4 py-2 bg-royal-accent hover:bg-royal-accent/90 text-white rounded-xl font-semibold text-xs tracking-wide flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                          >
                            <Plus className="h-4 w-4" />
                            Add Transaction
                          </button>
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center gap-4 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <Filter className="h-3.5 w-3.5" />
                          <span>Filter By:</span>
                        </div>

                        {/* Search in filters */}
                        <div className="w-56 relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-royal-accent"
                          />
                        </div>
                      </div>

                      {/* Transactions Table */}
                      <div className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Description</th>
                              <th className="px-6 py-4">Category</th>
                              <th className="px-6 py-4">Type</th>
                              <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {transactions
                              .filter(t => {
                                const descMatches = t.description.toLowerCase().includes(searchQuery.toLowerCase());
                                const categoryMatches = t.category.toLowerCase().includes(searchQuery.toLowerCase());
                                return descMatches || categoryMatches;
                              })
                              .map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-4.5 font-medium text-slate-500">{tx.date}</td>
                                  <td className="px-6 py-4.5 font-bold text-[#0B0F19]">{tx.description}</td>
                                  <td className="px-6 py-4.5">
                                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-bold text-slate-600">
                                      {tx.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4.5">
                                    <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wide inline-block ${
                                      tx.type === "income" ? "bg-emerald-50 text-emerald-accent" : "bg-red-50 text-coral-accent"
                                    }`}>
                                      {tx.type}
                                    </span>
                                  </td>
                                  <td className={`px-6 py-4.5 text-right font-extrabold ${
                                    tx.type === "income" ? "text-emerald-accent" : "text-[#0B0F19]"
                                  }`}>
                                    {tx.type === "income" ? "+" : "-"}{currencySymbol}{tx.amount.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}


                  {/* ==================== VIEW D: BUDGET PLANNER ==================== */}
                  {currentView === "budget" && (
                    <motion.div
                      key="budget-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex-1 flex flex-col gap-8 text-left"
                    >
                      {/* Header */}
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Budget Planner</h2>
                        <p className="text-xs text-slate-500">Compare your actual spending against target thresholds.</p>
                      </div>

                      {/* Main Layout: Left circular gauge & Category bars, Right AI sidebar */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Circular spent vs remaining & category breakdown list */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                          
                          {/* Top row: spent metrics cards */}
                          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row items-center gap-8">
                            
                            {/* Circular progress SVG */}
                            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                              <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                                <circle 
                                  cx="50" 
                                  cy="50" 
                                  r="40" 
                                  fill="none" 
                                  stroke="#3B82F6" 
                                  strokeWidth="8" 
                                  strokeDasharray="251" 
                                  strokeDashoffset={251 - (251 * Math.min(1, totalExpense / 100000))} 
                                  strokeLinecap="round" 
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Spent Rate</span>
                                <span className="text-xl font-black text-[#0B0F19]">
                                  {Math.round((totalExpense / 95000) * 100)}%
                                </span>
                                <span className="text-[9px] text-slate-400 font-medium">of {currencySymbol}95,000 limit</span>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col gap-4 text-left">
                              <div>
                                <h3 className="font-bold text-[#0B0F19]">Total Budget Overview</h3>
                                <p className="text-xs text-slate-400">Total limits are aggregate across all categories.</p>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase">Total Budget</span>
                                  <p className="text-sm font-extrabold text-[#0B0F19]">{currencySymbol}95,000</p>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase text-coral-accent">Total Spent</span>
                                  <p className="text-sm font-extrabold text-coral-accent">{currencySymbol}{totalExpense.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase text-emerald-accent">Remaining</span>
                                  <p className="text-sm font-extrabold text-emerald-accent">{currencySymbol}{(95000 - totalExpense).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Category breakdowns with Limit adjustments (interactive sliders) */}
                          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
                            <div>
                              <h4 className="font-bold text-sm text-[#0B0F19]">Adjust Limits By Category</h4>
                              <p className="text-xs text-slate-400">Drag sliders to modify limits in real-time.</p>
                            </div>

                            <div className="flex flex-col gap-5">
                              {budgets.map((b) => {
                                const percent = Math.min(100, Math.round((b.spent / b.limit) * 100));
                                return (
                                  <div key={b.category} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                      <span className="text-slate-700">{b.category}</span>
                                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${
                                        percent >= 90 ? "bg-red-50 text-coral-accent" : percent >= 70 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-accent"
                                      }`}>
                                        {percent}% Spent
                                      </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-300 ${
                                          percent >= 90 ? "bg-coral-accent" : percent >= 70 ? "bg-amber-500" : "bg-royal-accent"
                                        }`} 
                                        style={{ width: `${percent}%` }}
                                      />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                      <span>Spent: {currencySymbol}{b.spent.toLocaleString()}</span>
                                      <div className="flex items-center gap-2">
                                        <span>Limit: {currencySymbol}{b.limit.toLocaleString()}</span>
                                        <input
                                          type="range"
                                          min={Math.max(5000, b.spent - 2000)}
                                          max="60000"
                                          step="1000"
                                          value={b.limit}
                                          onChange={(e) => handleBudgetLimitChange(b.category, parseInt(e.target.value))}
                                          className="w-20 accent-royal-accent"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>

                        {/* AI Budget Optimization recommendations (Right sidebar) */}
                        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm text-left flex flex-col justify-between">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-accent/10 border border-emerald-accent/20 text-emerald-accent text-[9px] font-bold uppercase tracking-wider mb-4 animate-pulse-gentle">
                              <Sparkles className="h-3 w-3" />
                              AI Budget Advisory
                            </div>
                            <h4 className="font-bold text-sm text-[#0B0F19] mb-3">Optimization Tips</h4>

                            <div className="flex flex-col gap-4">
                              <div className="flex gap-3 text-xs bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                                <Info className="h-4.5 w-4.5 text-royal-accent shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-slate-700">Food Limit warning</p>
                                  <p className="text-slate-500 mt-1 leading-relaxed">
                                    Food category spent is at {Math.round((budgets.find(b => b.category === "Food")?.spent || 0) / (budgets.find(b => b.category === "Food")?.limit || 1) * 100)}%. We recommend trimming restaurant delivery budgets.
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-3 text-xs bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                                <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-slate-700">Entertainment Threshold</p>
                                  <p className="text-slate-500 mt-1 leading-relaxed">
                                    You have already spent 74% of your Entertainment budget. Suspend movie rentals to avoid exceeding limits.
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-3 text-xs bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                                <CheckCircle className="h-4.5 w-4.5 text-emerald-accent shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-slate-700">Savings Target Synced</p>
                                  <p className="text-slate-500 mt-1 leading-relaxed">
                                    Excellent! Decreasing your Shopping limit by 15% will free up {currencySymbol}2,500 that automatically syncs to goals.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setCurrentView("ai");
                              handleSendChat("Show me budget recommendations");
                            }}
                            className="w-full mt-6 py-2.5 bg-[#0B0F19] hover:bg-[#121826] text-white rounded-xl font-bold text-xs cursor-pointer transition-all"
                          >
                            Optimize Budgets with AI
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}


                  {/* ==================== VIEW E: GOALS TRACKER ==================== */}
                  {currentView === "goals" && (
                    <motion.div
                      key="goals-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex-1 flex flex-col gap-6 text-left"
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">Goals Tracker</h2>
                          <p className="text-xs text-slate-500">Setup and track savings milestones.</p>
                        </div>
                        <button
                          onClick={() => setShowAddGoal(true)}
                          className="px-4 py-2.5 bg-royal-accent hover:bg-royal-accent/90 text-white rounded-xl font-semibold text-xs tracking-wide flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                        >
                          <Plus className="h-4 w-4" />
                          New Goal
                        </button>
                      </div>

                      {/* Goal Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm text-left">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Goals</span>
                          <h4 className="text-xl font-black text-[#0B0F19] mt-1">{goals.length}</h4>
                        </div>
                        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm text-left">
                          <span className="text-[10px] text-emerald-accent font-bold uppercase">Completed</span>
                          <h4 className="text-xl font-black text-[#0B0F19] mt-1">
                            {goals.filter(g => g.current >= g.target).length}
                          </h4>
                        </div>
                        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm text-left">
                          <span className="text-[10px] text-royal-accent font-bold uppercase">In Progress</span>
                          <h4 className="text-xl font-black text-[#0B0F19] mt-1">
                            {goals.filter(g => g.current < g.target).length}
                          </h4>
                        </div>
                        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm text-left">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">On Hold</span>
                          <h4 className="text-xl font-black text-[#0B0F19] mt-1">0</h4>
                        </div>
                      </div>

                      {/* Goals rows list */}
                      <div className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm flex flex-col divide-y divide-slate-100">
                        {goals.map((goal) => {
                          const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                          return (
                            <div key={goal.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50 transition-all">
                              
                              {/* Left icon & name */}
                              <div className="flex items-center gap-4 shrink-0">
                                <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                                  {getGoalIcon(goal.icon)}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800 text-sm">{goal.name}</h4>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">{goal.category} • Target Date: {goal.date}</span>
                                </div>
                              </div>

                              {/* Middle progress bar */}
                              <div className="flex-1 w-full flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs font-bold">
                                  <span className="text-slate-600">Saved Progress</span>
                                  <span className="text-slate-800">{percent}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-accent rounded-full transition-all duration-500" 
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                  <span>Saved: {currencySymbol}{goal.current.toLocaleString()}</span>
                                  <span>Goal Limit: {currencySymbol}{goal.target.toLocaleString()}</span>
                                </div>
                              </div>

                              {/* Right status action trigger */}
                              <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-end">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                  percent >= 100 ? "bg-emerald-50 text-emerald-accent" : "bg-royal-accent/10 text-royal-accent"
                                }`}>
                                  {percent >= 100 ? "Completed" : "In Progress"}
                                </span>
                                
                                {/* Add funds button */}
                                {percent < 100 && (
                                  <button
                                    onClick={() => {
                                      setGoals(prev => prev.map(g => {
                                        if (g.id === goal.id) {
                                          const addVal = 5000;
                                          const nextVal = Math.min(g.target, g.current + addVal);
                                          
                                          // Add mock transaction of savings deposit
                                          const addedTx = {
                                            id: `tx-${Date.now()}`,
                                            date: new Date().toISOString().split("T")[0],
                                            description: `Savings: ${g.name}`,
                                            category: "Others",
                                            type: "expense" as const,
                                            amount: addVal
                                          };
                                          setTransactions([addedTx, ...transactions]);
                                          
                                          return { ...g, current: nextVal, status: nextVal >= g.target ? "Completed" : "In Progress" };
                                        }
                                        return g;
                                      }));
                                      setNotifications([`Deposited ${currencySymbol}5,000 into "${goal.name}"`, ...notifications]);
                                    }}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all cursor-pointer"
                                  >
                                    Add {currencySymbol}5K
                                  </button>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}


                  {/* ==================== VIEW F: AI ASSISTANT ==================== */}
                  {currentView === "ai" && (
                    <motion.div
                      key="ai-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex-1 flex flex-col gap-6 text-left max-w-4xl mx-auto w-full"
                    >
                      {/* Header */}
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">AI Financial Assistant</h2>
                        <p className="text-xs text-slate-500">Ask questions and optimize your budget thresholds.</p>
                      </div>

                      {/* Chatbox Panel */}
                      <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm flex flex-col h-[520px] overflow-hidden">
                        
                        {/* Conversation Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-accent to-royal-accent flex items-center justify-center font-bold text-black tracking-tight text-xs shadow-sm">
                              AI
                            </div>
                            <div>
                              <p className="font-bold text-xs text-slate-800">FinHealth Advisory Engine</p>
                              <span className="text-[10px] text-emerald-accent font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-accent rounded-full animate-pulse-gentle" /> Active Insights
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Chat History Messages */}
                        <div className="flex-1 p-6 overflow-y-auto no-scrollbar flex flex-col gap-4">
                          {chatMessages.map((msg, idx) => (
                            <div 
                              key={idx} 
                              className={`flex flex-col max-w-[80%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                            >
                              <div className={`p-4.5 rounded-[20px] text-xs leading-relaxed ${
                                msg.sender === "user" 
                                  ? "bg-[#0B0F19] text-white rounded-tr-none" 
                                  : "bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-none"
                              }`}>
                                <p className="whitespace-pre-line">{msg.text}</p>
                              </div>
                              <span className="text-[9px] text-slate-400 font-semibold mt-1 px-1.5">{msg.time}</span>
                            </div>
                          ))}

                          {isTyping && (
                            <div className="self-start flex flex-col items-start max-w-[80%]">
                              <div className="p-4 bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Sticky Action input & quick prompts */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                          
                          {/* Quick prompts chips */}
                          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            {CHAT_QUESTIONS.map((q) => (
                              <button
                                key={q.id}
                                onClick={() => handleSendChat(q.text)}
                                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-royal-accent text-slate-600 hover:text-royal-accent rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all"
                              >
                                {q.text}
                              </button>
                            ))}
                          </div>

                          {/* Text input row */}
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSendChat(chatInput);
                            }}
                            className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2"
                          >
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Ask anything about your budget, savings, or net worth..."
                              className="flex-1 bg-transparent text-xs text-[#0B0F19] placeholder-slate-400 focus:outline-none"
                            />
                            
                            {/* Voice dictation representation */}
                            <button 
                              type="button" 
                              onClick={() => handleSendChat("Automate my savings transfer")}
                              className="p-1 text-slate-400 hover:text-royal-accent transition-colors"
                              title="Voice dictate"
                            >
                              <Mic className="h-4 w-4" />
                            </button>

                            <button 
                              type="submit" 
                              className="p-2 bg-royal-accent hover:bg-royal-accent/90 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          </form>

                        </div>

                      </div>
                    </motion.div>
                  )}


                  {/* ==================== VIEW G: REPORTS ENGINE ==================== */}
                  {currentView === "reports" && (
                    <motion.div
                      key="reports-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex-1 flex flex-col gap-6 text-left"
                    >
                      {/* Header */}
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Executive Reports Engine</h2>
                        <p className="text-xs text-slate-500">Download formatted PDF files summarizing your asset growth and budgets.</p>
                      </div>

                      {/* Download rows list */}
                      <div className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm flex flex-col divide-y divide-slate-100">
                        
                        {/* Report Item 1 */}
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Financial Summary</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Includes full balances, scores, and historical trajectories • PDF (2.4 MB)</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(["Downloading PDF: Financial Summary report", ...notifications])}
                            className="px-4.5 py-2.5 bg-royal-accent hover:bg-royal-accent/90 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 self-end sm:self-center"
                          >
                            <Download className="h-4 w-4" /> Download PDF
                          </button>
                        </div>

                        {/* Report Item 2 */}
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-accent flex items-center justify-center">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Spending Analysis</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Drill-down charts of categories, merchant transactions, and outliers • PDF (4.8 MB)</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(["Downloading PDF: Spending Analysis report", ...notifications])}
                            className="px-4.5 py-2.5 bg-royal-accent hover:bg-royal-accent/90 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 self-end sm:self-center"
                          >
                            <Download className="h-4 w-4" /> Download PDF
                          </button>
                        </div>

                        {/* Report Item 3 */}
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Budget vs Actual</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Budget limit compliance rates, adjustments, and recommendations • PDF (1.9 MB)</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(["Downloading PDF: Budget vs Actual report", ...notifications])}
                            className="px-4.5 py-2.5 bg-royal-accent hover:bg-royal-accent/90 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 self-end sm:self-center"
                          >
                            <Download className="h-4 w-4" /> Download PDF
                          </button>
                        </div>

                        {/* Report Item 4 */}
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Goal Progress Tracker</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Maturity dates, milestones progress bars, and compound projection charts • PDF (3.1 MB)</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(["Downloading PDF: Goal Progress tracker report", ...notifications])}
                            className="px-4.5 py-2.5 bg-royal-accent hover:bg-royal-accent/90 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 self-end sm:self-center"
                          >
                            <Download className="h-4 w-4" /> Download PDF
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  )}


                  {/* ==================== VIEW H: SETTINGS ==================== */}
                  {currentView === "settings" && (
                    <motion.div
                      key="settings-view"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="flex-1 flex flex-col gap-8 text-left max-w-2xl"
                    >
                      {/* Header */}
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
                        <p className="text-xs text-slate-500">Configure personalization and details.</p>
                      </div>

                      {/* Settings Form Card */}
                      <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-500">Profile Full Name</label>
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent bg-slate-50 font-bold"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-500">Currency Symbol</label>
                          <select
                            value={currencySymbol}
                            onChange={(e) => setCurrencySymbol(e.target.value)}
                            className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent bg-slate-50 font-bold"
                          >
                            <option value="₹">₹ (INR - Rupee)</option>
                            <option value="$">$ (USD - Dollar)</option>
                            <option value="€">€ (EUR - Euro)</option>
                            <option value="£">£ (GBP - Pound)</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                          <span className="text-xs text-slate-400 font-semibold">Saved details automatically sync across all views.</span>
                          <button
                            onClick={() => {
                              setNotifications(["Profile and currency settings updated.", ...notifications]);
                              setCurrentView("dashboard");
                            }}
                            className="px-5 py-2.5 bg-emerald-accent text-black font-bold text-xs rounded-xl hover:bg-emerald-accent/90 transition-all cursor-pointer"
                          >
                            Save Settings
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* ==================== MOCK MODAL: ADD TRANSACTION ==================== */}
      <AnimatePresence>
        {showAddTx && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-[24px] max-w-md w-full p-6 text-left relative"
            >
              <button 
                onClick={() => setShowAddTx(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Log Transaction</h3>

              <form onSubmit={handleAddTransaction} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Description</label>
                  <input
                    type="text"
                    required
                    value={newTx.description}
                    onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                    placeholder="e.g., Grocery Shopping, Salary"
                    className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Amount</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newTx.amount}
                      onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                      placeholder="e.g., 2500"
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Type</label>
                    <select
                      value={newTx.type}
                      onChange={(e) => setNewTx({ ...newTx, type: e.target.value, category: e.target.value === "income" ? "Salary" : "Food" })}
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Category</label>
                    <select
                      value={newTx.category}
                      onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                    >
                      {newTx.type === "income" ? (
                        <>
                          <option value="Salary">Salary</option>
                          <option value="Others">Others</option>
                        </>
                      ) : (
                        <>
                          <option value="Food">Food</option>
                          <option value="Housing">Housing</option>
                          <option value="Transport">Transport</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Others">Others</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Date</label>
                    <input
                      type="date"
                      required
                      value={newTx.date}
                      onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full mt-2 py-3 bg-[#0B0F19] hover:bg-[#121826] text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  Save Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ==================== MOCK MODAL: ADD GOAL ==================== */}
      <AnimatePresence>
        {showAddGoal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-[24px] max-w-md w-full p-6 text-left relative"
            >
              <button 
                onClick={() => setShowAddGoal(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Create Financial Goal</h3>

              <form onSubmit={handleAddGoal} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    placeholder="e.g., Emergency Fund, Laptop"
                    className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Target Amount</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      placeholder="e.g., 100000"
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Starting Amount</label>
                    <input
                      type="number"
                      min="0"
                      value={newGoal.current}
                      onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                      placeholder="e.g., 5000"
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Category</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                    >
                      <option value="Savings">Savings</option>
                      <option value="Travel">Travel</option>
                      <option value="Asset">Asset</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Target Date</label>
                    <input
                      type="date"
                      value={newGoal.date}
                      onChange={(e) => setNewGoal({ ...newGoal, date: e.target.value })}
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B0F19] focus:outline-none focus:border-royal-accent"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full mt-2 py-3 bg-[#0B0F19] hover:bg-[#121826] text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  Create Goal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SCREEN: ONBOARDING & BASIC INFO COLLECTION MODAL ==================== */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel-dark text-white max-w-lg w-full p-8 rounded-[24px] shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowOnboarding(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-accent to-royal-accent flex items-center justify-center font-bold text-black text-xs">
                    FH
                  </div>
                  <span className="font-bold text-sm tracking-tight">FinHealth Onboarding</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                  <span className={`px-2 py-0.5 rounded ${onboardingStep === 1 ? 'bg-royal-accent text-white' : 'bg-white/10'}`}>1</span>
                  <span>/</span>
                  <span className={`px-2 py-0.5 rounded ${onboardingStep === 2 ? 'bg-royal-accent text-white' : 'bg-white/10'}`}>2</span>
                </div>
              </div>

              <form onSubmit={handleOnboardingSubmit} className="flex flex-col gap-5">
                
                {/* STEP 1: Identity & Currency */}
                {onboardingStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">Create Your Profile</h3>
                      <p className="text-xs text-slate-400 mt-1">Let's verify your identity and baseline currency settings.</p>
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={onboardForm.fullName}
                        onChange={(e) => setOnboardForm({ ...onboardForm, fullName: e.target.value })}
                        placeholder="Rahul Verma"
                        className="bg-white/[0.03] border border-white/[0.08] focus:border-royal-accent rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={onboardForm.email}
                        onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                        placeholder="rahul.verma@example.com"
                        className="bg-white/[0.03] border border-white/[0.08] focus:border-royal-accent rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Password (Min 6 chars)</label>
                      <input
                        type="password"
                        required
                        value={onboardForm.password}
                        onChange={(e) => setOnboardForm({ ...onboardForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="bg-white/[0.03] border border-white/[0.08] focus:border-royal-accent rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Base Currency</label>
                      <select
                        value={onboardForm.currency}
                        onChange={(e) => setOnboardForm({ ...onboardForm, currency: e.target.value })}
                        className="bg-[#121826] border border-white/[0.08] focus:border-royal-accent rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                      >
                        <option value="₹">INR (₹ - Indian Rupee)</option>
                        <option value="$">USD ($ - US Dollar)</option>
                        <option value="€">EUR (€ - Euro)</option>
                        <option value="£">GBP (£ - British Pound)</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      disabled={!isStep1Valid}
                      onClick={() => setOnboardingStep(2)}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs mt-3 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isStep1Valid 
                          ? 'bg-royal-accent hover:bg-royal-accent/90 text-white' 
                          : 'bg-white/[0.05] text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Next Step <ChevronRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: Base Financial Metrics */}
                {onboardingStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">Enter Baseline Metrics</h3>
                      <p className="text-xs text-slate-400 mt-1">Specify your baseline numbers to calibrate the scoring algorithms.</p>
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimated Monthly Income ({onboardForm.currency})</label>
                      <input
                        type="number"
                        required
                        min="1000"
                        value={onboardForm.monthlyIncome}
                        onChange={(e) => setOnboardForm({ ...onboardForm, monthlyIncome: e.target.value })}
                        placeholder="e.g. 125000"
                        className="bg-white/[0.03] border border-white/[0.08] focus:border-royal-accent rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Baseline Monthly Fixed Expenses ({onboardForm.currency})</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={onboardForm.monthlyExpenses}
                        onChange={(e) => setOnboardForm({ ...onboardForm, monthlyExpenses: e.target.value })}
                        placeholder="e.g. 74850"
                        className="bg-white/[0.03] border border-white/[0.08] focus:border-royal-accent rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Total Net Worth / Savings ({onboardForm.currency})</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={onboardForm.netWorth}
                        onChange={(e) => setOnboardForm({ ...onboardForm, netWorth: e.target.value })}
                        placeholder="e.g. 845000"
                        className="bg-white/[0.03] border border-white/[0.08] focus:border-royal-accent rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder-slate-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <button
                        type="button"
                        onClick={() => setOnboardingStep(1)}
                        className="w-full py-3.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-slate-300 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>

                      <button
                        type="submit"
                        disabled={!isStep2Valid}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          isStep2Valid 
                            ? 'bg-emerald-accent text-[#0B0F19] hover:bg-emerald-accent/90 shadow-lg shadow-emerald-500/20' 
                            : 'bg-white/[0.05] text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Generate Score
                      </button>
                    </div>
                  </motion.div>
                )}

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SCREEN: PREMIUM PRICING MATRIX MODAL ==================== */}
      <AnimatePresence>
        {showPricing && (
          <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel-dark text-white max-w-4xl w-full p-8 rounded-[24px] shadow-2xl relative"
            >
              <button
                onClick={() => setShowPricing(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center max-w-xl mx-auto mb-8">
                <h3 className="text-2xl font-bold tracking-tight text-white">Simple, Premium Pricing</h3>
                <p className="text-xs text-slate-400 mt-1.5">Calibrate your subscription tier to access dynamic scoring and unlimited portfolios.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Free plan */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Free Starter</span>
                    <h4 className="text-3xl font-black mt-2">₹0 <span className="text-xs font-semibold text-slate-500">/mo</span></h4>
                    <p className="text-slate-400 text-xs mt-3 leading-relaxed">Basic overview of your credit variables and score previews.</p>
                    <ul className="text-xs text-slate-400 flex flex-col gap-2 mt-6">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> 1 User Account</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> Up to 10 Ledger entries</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> Semicircle Preview Gauge</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowPricing(false); setShowOnboarding(true); }}
                    className="w-full py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl text-xs font-bold transition-all mt-8 cursor-pointer"
                  >
                    Start Free
                  </button>
                </div>

                {/* Premium plan */}
                <div className="bg-emerald-accent/5 border border-emerald-accent/20 rounded-2xl p-6 flex flex-col justify-between text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-accent text-black text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    Popular
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-accent font-bold uppercase tracking-wider">Premium Growth</span>
                    <h4 className="text-3xl font-black mt-2 text-white">₹1,250 <span className="text-xs font-semibold text-slate-500">/mo</span></h4>
                    <p className="text-slate-400 text-xs mt-3 leading-relaxed">Dynamic health scoring, unlimited transactions, and personalized AI tips.</p>
                    <ul className="text-xs text-slate-300 flex flex-col gap-2 mt-6">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> Unlimited Transactions</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> Dynamic Math scoring engine</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> AI chatbot Assistant</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> Executive PDF downloads</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowPricing(false); setShowOnboarding(true); setOnboardingStep(1); }}
                    className="w-full py-2.5 bg-emerald-accent text-black rounded-xl text-xs font-bold hover:bg-emerald-accent/90 transition-all mt-8 cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    Get Started
                  </button>
                </div>

                {/* Enterprise plan */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Enterprise Elite</span>
                    <h4 className="text-3xl font-black mt-2">₹4,500 <span className="text-xs font-semibold text-slate-500">/mo</span></h4>
                    <p className="text-slate-400 text-xs mt-3 leading-relaxed">Advanced portfolio management, custom corporate APIs, and 24/7 support.</p>
                    <ul className="text-xs text-slate-400 flex flex-col gap-2 mt-6">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> Multi-account sync</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> Custom API access keys</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-accent" /> Dedicated Financial advisor</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowPricing(false); setShowContact(true); }}
                    className="w-full py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl text-xs font-bold transition-all mt-8 cursor-pointer"
                  >
                    Contact Sales
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SCREEN: CONTACT PROFILE MODAL ==================== */}
      <AnimatePresence>
        {showContact && (
          <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel-dark text-white max-w-md w-full p-8 rounded-[24px] shadow-2xl relative"
            >
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-bold tracking-tight text-white">Get in Touch</h3>
                <p className="text-xs text-slate-400 mt-1">Connect directly with Sivasangaran for questions or corporate validations.</p>
              </div>

              {/* Direct Actions block */}
              <div className="flex flex-col gap-4 mb-6">
                <a
                  href="mailto:sivasangaran1512@gmail.com"
                  className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] rounded-xl text-xs text-slate-300 hover:text-white transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 text-[10px] uppercase">Email Creator</p>
                    <p className="font-semibold mt-0.5">sivasangaran1512@gmail.com</p>
                  </div>
                </a>

                <a
                  href="tel:+918056239558"
                  className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] rounded-xl text-xs text-slate-300 hover:text-white transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-royal-accent/10 flex items-center justify-center text-royal-accent shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 text-[10px] uppercase">Phone Hotline</p>
                    <p className="font-semibold mt-0.5">+91 8056239558</p>
                  </div>
                </a>
              </div>

              {/* Messaging & Social CTAs */}
              <div className="flex flex-col gap-3">
                {/* WhatsApp Message CTA */}
                <a
                  href="https://wa.me/918056239558?text=Hi%20Sivasangaran,%20I%20saw%20your%20FinHealth%20platform..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  Message me on WhatsApp
                </a>

                {/* LinkedIn Professional CTA */}
                <a
                  href="https://www.linkedin.com/in/sivasangaran-s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#0077b5] hover:bg-[#006297] text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#0077b5]/10"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  Connect on LinkedIn
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
