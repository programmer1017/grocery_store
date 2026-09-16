import React, { useState } from "react";
import { useQuery, useMutation, queryClient } from "@tanstack/react-query";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("مشروبات ومياه");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // جلب المنتجات الحالية من قاعدة البيانات
  const { data: products = [] } = useQuery({ queryKey: ["/api/products"] });

  // إضافة منتج بالصورة الحقيقية
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    if (imageFile) formData.append("image", imageFile);

    await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    setName("");
    setPrice("");
    setImageFile(null);
    alert("تم إضافة المنتج بنجاح!");
  };

  // حذف منتج غير موجود بالبقالة
  const handleDelete = async (id: number) => {
    if (confirm("هل انت متأكد من حذف هذا المنتج؟")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      alert("تم الحذف");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", direction: "rtl" }}>
      <h2>⚙️ لوحة صاحب البقالة (إدارة الصور والرفوف)</h2>

      {/* نموذج إضافة المنتجات الصور الحقيقية */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #ddd" }}>
        <h3>➕ إضافة منتج جديد بالصورة الحقيقية</h3>
        <form onSubmit={handleAddProduct} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
          <input 
            type="text" 
            placeholder="اسم المنتج (مثال: حليب المراعي 1 لتر)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="مشروبات ومياه">مشروبات ومياه</option>
            <option value="حلويات وسناك">حلويات وسناك</option>
            <option value="مخبوزات">مخبوزات</option>
            <option value="فواكه وخضار">فواكه وخضار</option>
            <option value="منتجات الألبان">منتجات الألبان</option>
          </select>
          <input 
            type="number" 
            step="0.25" 
            placeholder="السعر (ر.س)" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />
          <label>📷 اختر صورة حقيقية للمنتج من جهازك:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
            required 
          />
          <button type="submit" style={{ background: "#10b981", color: "#fff", padding: "10px", border: "none", borderRadius: "6px" }}>
            حفظ ونشر المنتج
          </button>
        </form>
      </div>

      {/* قائمة المنتجات المتاحة للتعديل والحذف */}
      <h3 style={{ marginTop: "30px" }}>📦 المنتجات المعروضة في الموقع</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
        {products.map((p: any) => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px", background: "#fff" }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px" }} />
            <h4>{p.name}</h4>
            <p>{p.price} ر.س</p>
            <button 
              onClick={() => handleDelete(p.id)} 
              style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
            >
              🗑️ حذف المنتج
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
