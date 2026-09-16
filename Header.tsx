import React from "react";
import { useQuery } from "@tanstack/react-query";

export function WhatsAppButton() {
  const { data } = useQuery({ queryKey: ["/api/store-info"] });
  const phone = data?.whatsapp || "966500000000"; // رقمك الحقيقي

  const openWhatsApp = () => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent("مرحباً، أريد الطلب من البقالة")}`;
    window.open(url, "_blank");
  };

  return (
    <button 
      onClick={openWhatsApp}
      style={{
        background: "#25D366",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: "25px",
        border: "none",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      💬 تواصل واتساب مع البقالة
    </button>
  );
}
