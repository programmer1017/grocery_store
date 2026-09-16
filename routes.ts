import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import express from "express";
import { storage } from "./storage";

// إعداد رفع الصور الحقيقية من جهاز صاحب البقالة
const uploadStorage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: uploadStorage });

export async function registerRoutes(app: Express): Promise<Server> {
  // توفير المجلد الذي يحفظ الصور
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // 1. رقم التواصل الخاص بالبقالة (يمكنك تعديل الرقم هنا مباشرة)
  const STORE_WHATSAPP_NUMBER = "966500000000"; // استبدل هذا برقمك الحقيقي

  app.get("/api/store-info", (req, res) => {
    res.json({ whatsapp: STORE_WHATSAPP_NUMBER });
  });

  // 2. رفع صورة منتج حقيقية وإضافة المنتج
  app.post("/api/products", upload.single("image"), async (req, res) => {
    try {
      const { name, category, price, inStock } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : "/uploads/default.jpg";
      
      const newProduct = await storage.createProduct({
        name,
        category,
        price: parseFloat(price),
        image: imageUrl,
        inStock: inStock === "true" || inStock === true
      });
      res.json(newProduct);
    } catch (err) {
      res.status(400).json({ message: "فشل إضافة المنتج" });
    }
  });

  // 3. حذف منتج من البقالة (في حال عدم توفره أو الخطأ)
  app.delete("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteProduct(id);
    res.json({ success: true, message: "تم حذف المنتج بنجاح" });
  });

  // 4. تعديل بيانات منتج (السعر أو الاسم أو الحالة)
  app.patch("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await storage.updateProduct(id, req.body);
    res.json(updated);
  });

  const httpServer = createServer(app);
  return httpServer;
}
