# 📌 Sticky Columns Guide - Qotib Turgan Ustunlar

## ✅ Nima Qilindi?

Dashboard'dagi **Qarzdorliklar** jadvalidagi quyidagi ustunlar **fixed** (qotib turgan) qilindi:

1. ✅ **Kun** - Chapda qotib turadi (offset: 0px)
2. ✅ **Ism-Familiya** - Chapda qotib turadi (offset: 60px)

## 🎯 Qanday Ishlaydi?

### **Sticky Columns Funksiyasi:**

Jadvalda gorizontal scroll qilganda, belgilangan ustunlar o'z joyida qotib turadi va doimo ko'rinib turadi.

### **Texnik Tafsilotlar:**

```typescript
// Column interface'ga qo'shilgan yangi propertylar:
interface Column {
  sticky?: "left" | "right";  // Qaysi tomonda qotib turishi
  stickyOffset?: number;       // Boshqa sticky ustunlardan offset (px)
}
```

### **Misol:**

```typescript
{
  id: "contractDay",
  label: "Kun",
  sticky: "left",        // Chapda qotib turadi
  stickyOffset: 0,       // 0px offset (birinchi ustun)
  minWidth: 60,
}

{
  id: "fullName",
  label: "Ism-Familiya",
  sticky: "left",        // Chapda qotib turadi
  stickyOffset: 60,      // 60px offset (ikkinchi ustun)
  minWidth: 150,
}
```

## 🎨 Vizual Effektlar:

- ✅ **Box Shadow** - Qotib turgan ustunlar soya bilan ajralib turadi
- ✅ **Z-Index** - To'g'ri qatlamlanish (header: 2, body: 1)
- ✅ **Background Color** - Oq fon (scroll qilganda orqa ustunlar ko'rinmaydi)

## 📋 Qo'shimcha Ustunlarni Sticky Qilish:

Agar boshqa ustunlarni ham sticky qilmoqchi bo'lsangiz:

```typescript
// O'ng tomonda sticky qilish:
{
  id: "manager",
  label: "Menejer",
  sticky: "right",
  stickyOffset: 0,
}

// Chap tomonda bir nechta sticky ustunlar:
{
  id: "column1",
  sticky: "left",
  stickyOffset: 0,      // 1-ustun
}
{
  id: "column2",
  sticky: "left",
  stickyOffset: 100,    // 2-ustun (1-ustun kengligi + offset)
}
{
  id: "column3",
  sticky: "left",
  stickyOffset: 250,    // 3-ustun (1+2 ustunlar kengligi + offset)
}
```

## 🔧 O'zgartirilgan Fayllar:

1. **damen-web/src/components/table/types.ts**
   - `Column` interface'ga `sticky` va `stickyOffset` qo'shildi

2. **damen-web/src/components/table/Table.tsx**
   - TableHead va TableBody'da sticky styles qo'shildi
   - Checkbox ustuni ham sticky qilindi (selectable mode'da)

3. **damen-web/src/sections/debtor/view/columns.ts**
   - `contractDay` va `fullName` ustunlariga sticky property qo'shildi

## 🚀 Natija:

Endi **Qarzdorliklar** jadvalida:
- ✅ "Kun" ustuni doimo chapda ko'rinadi
- ✅ "Ism-Familiya" ustuni doimo chapda ko'rinadi
- ✅ Gorizontal scroll qilganda bu ustunlar qotib turadi
- ✅ Checkbox (tanlash) ustuni ham qotib turadi
- ✅ Soya effekti bilan ajralib turadi

## 📱 Responsive:

Sticky columns barcha ekran o'lchamlarida ishlaydi va mobil qurilmalarda ham to'g'ri ko'rinadi.

## 🎉 Qo'shimcha Imkoniyatlar:

Agar kerak bo'lsa, quyidagilarni ham qo'shish mumkin:
- O'ng tomonda sticky ustunlar (masalan, "Actions" ustuni)
- Bir nechta sticky ustunlar (chap va o'ng tomonlarda)
- Dinamik sticky (foydalanuvchi tanlashi mumkin)

---

**Muallif:** Kiro AI Assistant  
**Sana:** 2024  
**Versiya:** 1.0
