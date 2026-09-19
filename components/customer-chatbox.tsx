"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Headphones,
  Loader2,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  User,
  X
} from "lucide-react";
import {
  getChatSessionAction,
  sendGuestMessageAction
} from "@/app/actions/chat";
import { extractVietnamesePhone } from "@/lib/ai/indigenous-chat-bot";
import { useLanguage } from "@/components/i18n-provider";

type Message = {
  id: string;
  role: "staff" | "guest";
  text: string;
  createdAt: string;
};

const STORAGE_KEY = "cham_aluoi_chat_session_id";
const GUEST_INFO_KEY = "cham_aluoi_guest_info";
const MESSAGES_CACHE_KEY = "cham_aluoi_chat_messages_cache";
const CHAT_OPEN_KEY = "cham_aluoi_chat_open_state";

const DEFAULT_WELCOME_MSG: Message = {
  id: "welcome-1",
  role: "staff",
  text: "Xin chào quý khách! 🌿 Em là Trợ lý AI Bản Địa của Chạm A Lưới. Quý khách cần hỏi giá phòng homestay, đặc sản gà nướng cơm lam hay lịch trình tour 2N1Đ cứ nhắn em hỗ trợ tức thì nhé ạ!",
  createdAt: new Date().toISOString()
};

const QUICK_PROMPTS = [
  { label: "🏡 Giá phòng homestay?", prompt: "Giá phòng homestay bao nhiêu một đêm và có những loại phòng nào ạ?" },
  { label: "🍗 Đặc sản có gì ngon?", prompt: "Đặc sản A Lưới có món gì ngon và menu ăn uống ra sao ạ?" },
  { label: "🌿 Lịch trình Tour 2N1Đ?", prompt: "Tư vấn cho mình lịch trình Tour trải nghiệm 2N1Đ trọn gói với ạ" },
  { label: "🎁 Nhận Voucher giảm 10%", prompt: "Cho mình xin mã Voucher ưu đãi giảm giá 10% với nhé!" }
];

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = `chat-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }
  return id;
}

export function CustomerChatbox() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [showInfoInputs, setShowInfoInputs] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MSG]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Khởi tạo: Nạp sessionId, thông tin khách và lịch sử tin nhắn từ LocalStorage ngay khi tải trang
  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeSessionId = getOrCreateSessionId();
      setSessionId(activeSessionId);

      // Đọc trạng thái mở chatbox khi chuyển trang
      const savedOpenState = sessionStorage.getItem(CHAT_OPEN_KEY);
      if (savedOpenState === "true") {
        setOpen(true);
      }

      // Nạp thông tin khách đã nhập trước đó
      try {
        const savedInfo = localStorage.getItem(GUEST_INFO_KEY);
        if (savedInfo) {
          const parsed = JSON.parse(savedInfo);
          if (parsed.name) setGuestName(parsed.name);
          if (parsed.phone) setGuestPhone(parsed.phone);
        }
      } catch {
        // ignore
      }

      // Nạp tin nhắn đã lưu trước từ LocalStorage để hiển thị tức thì (Zero-latency)
      try {
        const cached = localStorage.getItem(MESSAGES_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch {
        // ignore
      }

      // Đồng bộ ngay với Database Supabase PostgreSQL ở chế độ nền
      if (activeSessionId) {
        syncMessagesFromDatabase(activeSessionId);
      }
    }
  }, []);

  // Hàm đồng bộ tin nhắn từ Database PostgreSQL (Supabase)
  async function syncMessagesFromDatabase(targetSessionId: string) {
    if (!targetSessionId) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${targetSessionId}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.session && Array.isArray(data.session.messages) && data.session.messages.length > 0) {
          setMessages(data.session.messages);
          if (data.session.guestPhone && !guestPhone) {
            setGuestPhone(data.session.guestPhone);
          }
          try {
            localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(data.session.messages));
          } catch {
            // ignore
          }
          return;
        }
      }

      // Fallback Server Action nếu API route bận
      const session = await getChatSessionAction(targetSessionId);
      if (session && Array.isArray(session.messages) && session.messages.length > 0) {
        setMessages(session.messages);
        if (session.guestPhone && !guestPhone) {
          setGuestPhone(session.guestPhone);
        }
        try {
          localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(session.messages));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("[CHAT_SYNC_ERR]", err);
    }
  }

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, isAiTyping]);

  // Polling định kỳ lấy phản hồi của Admin khi đang mở hộp chat
  useEffect(() => {
    if (!open || !sessionId) return;

    syncMessagesFromDatabase(sessionId);

    const timer = setInterval(() => {
      syncMessagesFromDatabase(sessionId);
    }, 3500);

    return () => clearInterval(timer);
  }, [open, sessionId]);

  // Lưu trạng thái mở/đóng vào SessionStorage khi người dùng click
  const handleToggleOpen = (newOpen: boolean) => {
    setOpen(newOpen);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(CHAT_OPEN_KEY, String(newOpen));
    }
  };

  // Gửi tin nhắn và nhận phản hồi AI tự động
  const handleSendText = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const currentSessionId = sessionId || getOrCreateSessionId();
    if (!sessionId) setSessionId(currentSessionId);

    // Tự động phát hiện Số Điện Thoại trong tin nhắn
    const phoneFound = extractVietnamesePhone(trimmed);
    let effectivePhone = guestPhone;
    if (phoneFound) {
      effectivePhone = phoneFound;
      setGuestPhone(phoneFound);
      try {
        localStorage.setItem(
          GUEST_INFO_KEY,
          JSON.stringify({ name: guestName, phone: phoneFound })
        );
      } catch {
        // ignore
      }
    } else if (guestName || guestPhone) {
      try {
        localStorage.setItem(
          GUEST_INFO_KEY,
          JSON.stringify({ name: guestName, phone: guestPhone })
        );
      } catch {
        // ignore
      }
    }

    const tempGuestMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "guest",
      text: trimmed,
      createdAt: new Date().toISOString()
    };

    // Optimistic UI: Hiển thị ngay lập tức tin nhắn của khách
    const updatedMessages = [...messages, tempGuestMsg];
    setMessages(updatedMessages);
    setMessage("");
    setIsSending(true);
    setIsAiTyping(true);

    try {
      localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(updatedMessages));
    } catch {
      // ignore
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          guestName: guestName.trim() || "Khách truy cập",
          guestPhone: effectivePhone.trim() || undefined,
          text: trimmed,
          role: "guest"
        })
      });

      const data = await res.json();
      if (data.success && data.session && Array.isArray(data.session.messages)) {
        // Hiệu ứng delay tự nhiên để hiển thị AI đang soạn tin
        setTimeout(() => {
          setMessages(data.session.messages);
          setIsAiTyping(false);
          try {
            localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(data.session.messages));
          } catch {
            // ignore
          }
        }, 600);
        return;
      }

      // Fallback Server Action
      const fallbackRes = await sendGuestMessageAction({
        sessionId: currentSessionId,
        guestName: guestName.trim() || "Khách truy cập",
        guestPhone: effectivePhone.trim() || undefined,
        text: trimmed
      });
      if (fallbackRes.success && fallbackRes.session?.messages) {
        setMessages(fallbackRes.session.messages);
        try {
          localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(fallbackRes.session.messages));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Không thể lưu tin nhắn vào Database:", err);
    } finally {
      setIsSending(false);
      setIsAiTyping(false);
    }
  };

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendText(message);
  };

  return (
    <aside className="fixed bottom-5 right-5 z-[60]" aria-label="Chat hỗ trợ khách hàng">
      {open ? (
        <section className="mb-4 flex h-[540px] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-forest/15 bg-white shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <header className="flex items-center justify-between bg-[#0F382E] px-4 py-3.5 text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative grid size-10 place-items-center rounded-full bg-white/20">
                <Headphones className="size-5" aria-hidden="true" />
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F382E]" />
              </div>
              <div>
                <strong className="block text-sm font-bold flex items-center gap-1.5">
                  {isEn ? "Cham A Luoi Assistant" : "Tư vấn Chạm A Lưới"}
                  <span className="rounded-full bg-emerald-500/30 text-emerald-200 px-2 py-0.5 text-[9px] font-extrabold tracking-wider border border-emerald-400/30 flex items-center gap-0.5">
                    <Sparkles className="size-2.5" /> AI 24/7
                  </span>
                </strong>
                <p className="flex items-center gap-1.5 text-[11px] text-white/80">
                  <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  {isEn ? "Indigenous AI Assistant • Instant reply" : "Trợ lý AI Bản Địa • Trả lời tức thì trong 3s"}
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label={isEn ? "Close chat" : "Đóng chat"}
              onClick={() => handleToggleOpen(false)}
              className="rounded-full p-2 text-white/80 hover:bg-white/15 hover:text-white transition"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>

          {/* Guest info banner */}
          <div className="border-b border-black/5 bg-emerald-50/70 px-4 py-2">
            <button
              type="button"
              onClick={() => setShowInfoInputs(!showInfoInputs)}
              className="flex w-full items-center justify-between text-[11px] font-semibold text-emerald-950 hover:text-forest"
            >
              <span className="flex items-center gap-1.5 truncate">
                {guestPhone ? (
                  <>
                    <span className="size-2 rounded-full bg-emerald-600" />
                    <span>{isEn ? "Contact phone:" : "SĐT nhận ưu đãi:"} <strong className="font-mono text-emerald-800">{guestPhone}</strong></span>
                  </>
                ) : (
                  <span>{isEn ? "🎁 Leave your phone/WhatsApp for 10% voucher" : "🎁 Để lại SĐT/Zalo nhận ảnh thực tế & Voucher 10%"}</span>
                )}
              </span>
              {showInfoInputs ? <ChevronUp className="size-3.5 shrink-0" /> : <ChevronDown className="size-3.5 shrink-0" />}
            </button>

            {showInfoInputs && (
              <div className="mt-2 grid grid-cols-2 gap-2 pb-1 animate-in fade-in">
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 size-3.5 text-ink/40" />
                  <input
                    type="text"
                    placeholder={isEn ? "Your Name" : "Tên của bạn"}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full rounded-xl bg-white pl-8 pr-2 py-1.5 text-xs text-ink border border-black/10 focus:outline-none focus:border-forest"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 size-3.5 text-ink/40" />
                  <input
                    type="tel"
                    placeholder={isEn ? "Phone / WhatsApp" : "Số điện thoại / Zalo"}
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full rounded-xl bg-white pl-8 pr-2 py-1.5 text-xs text-ink border border-black/10 focus:outline-none focus:border-forest"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Messages list */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F7F8F7] p-4 text-xs">
            {messages.map((item, index) => {
              const isGuest = item.role === "guest";
              const isInitialWelcome = item.id === "welcome-1";
              const messageText = isInitialWelcome && isEn
                ? "Hello! 🌿 I am the Indigenous AI Assistant of Cham A Luoi. Feel free to ask about homestay rates, local bamboo-tube rice, waterfalls, or 2D1N tour itineraries!"
                : item.text;

              const timeStr = item.createdAt
                ? new Date(item.createdAt).toLocaleTimeString(isEn ? "en-US" : "vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "";

              return (
                <div
                  key={item.id || `${item.role}-${index}`}
                  className={`flex flex-col ${isGuest ? "items-end" : "items-start"}`}
                >
                  <div
                    className={
                      isGuest
                        ? "max-w-[85%] rounded-2xl rounded-tr-xs bg-forest px-4 py-2.5 text-xs leading-5 text-white shadow-sm whitespace-pre-line"
                        : "max-w-[88%] rounded-2xl rounded-tl-xs bg-white border border-black/5 px-4 py-3 text-xs leading-relaxed text-ink shadow-sm whitespace-pre-line"
                    }
                  >
                    {messageText}
                  </div>
                  {timeStr && (
                    <span className="mt-1 text-[10px] text-ink/40 px-1 flex items-center gap-1">
                      {isGuest ? (
                        (isEn ? "You • " : "Bạn • ") + timeStr
                      ) : (
                        <>
                          <Sparkles className="size-2.5 text-emerald-600" />
                          <span>{(isEn ? "AI Assistant • " : "Trợ lý AI Bản Địa • ") + timeStr}</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isAiTyping && (
              <div className="flex flex-col items-start animate-in fade-in">
                <div className="rounded-2xl rounded-tl-xs bg-white border border-emerald-500/20 px-3.5 py-2.5 text-xs text-forest shadow-xs flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-forest animate-bounce [animation-delay:-0.3s]" />
                    <span className="size-1.5 rounded-full bg-forest animate-bounce [animation-delay:-0.15s]" />
                    <span className="size-1.5 rounded-full bg-forest animate-bounce" />
                  </div>
                  <span className="text-[11px] font-medium text-ink/70">
                    {isEn ? "AI Assistant is typing..." : "Trợ lý Chạm A Lưới đang soạn câu trả lời..."}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 4 Quick Prompts */}
          <div className="bg-white px-3 py-2 border-t border-black/5">
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-[10px] font-bold text-ink/50 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" /> {isEn ? "1-Click Quick Prompts:" : "Câu hỏi nhanh 1 chạm:"}
              </span>
              <span className="text-[10px] text-forest font-semibold">{isEn ? "Instant AI < 3s" : "Tự động trả lời < 3s"}</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {(isEn
                ? [
                    { label: "🏡 Homestay Rates?", prompt: "What are the homestay room rates per night and available room types?" },
                    { label: "🍗 Local Food Menu?", prompt: "What are the must-try highland specialties and dining options in A Luoi?" },
                    { label: "🌿 2D1N Tour Plan?", prompt: "Can you recommend an all-inclusive 2 Days 1 Night tour itinerary?" },
                    { label: "🎁 10% Off Voucher", prompt: "How can I claim the 10% discount voucher for my trip?" }
                  ]
                : QUICK_PROMPTS
              ).map((q) => (
                <button
                  key={q.label}
                  type="button"
                  disabled={isSending}
                  onClick={() => handleSendText(q.prompt)}
                  className="shrink-0 rounded-full bg-forest/5 border border-forest/20 px-3 py-1 text-[11px] font-bold text-forest hover:bg-forest hover:text-white transition active:scale-95 disabled:opacity-50 shadow-xs flex items-center gap-1"
                >
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmitForm} className="flex items-center gap-2 border-t border-black/10 bg-white p-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isEn ? "Ask about homestays, waterfalls, food, or leave phone..." : "Hỏi giá phòng, đặc sản hoặc gửi SĐT/Zalo..."}
              className="min-w-0 flex-1 rounded-full bg-beige/60 px-4 py-2.5 text-xs text-ink placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              aria-label={isEn ? "Send message" : "Gửi tin nhắn"}
              className="grid size-10 place-items-center rounded-full bg-forest text-white hover:bg-ink transition disabled:opacity-50 shrink-0 shadow-sm"
            >
              {isSending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
            </button>
          </form>
        </section>
      ) : null}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => handleToggleOpen(!open)}
        className="group relative ml-auto flex items-center gap-3 rounded-full bg-forest px-5 py-3.5 font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink hover:shadow-xl active:scale-95"
        aria-label={isEn ? "Open live support chat" : "Mở chat hỗ trợ khách hàng"}
      >
        <span className="relative">
          <MessageCircle className="size-5 transition group-hover:scale-110" aria-hidden="true" />
          <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400 ring-2 ring-forest" />
        </span>
        <span className="text-sm flex items-center gap-1.5">
          <span>{isEn ? "Live Chat Assistant" : "Tư vấn trực tuyến"}</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-extrabold uppercase">AI</span>
        </span>
      </button>
    </aside>
  );
}
