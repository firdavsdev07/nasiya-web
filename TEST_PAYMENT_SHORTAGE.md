# Test: Kam To'langan To'lovni Ko'rsatish

## Muammo
Rasmda ko'rinib turibdiki, 3-oy uchun 13$ to'langan (130$ o'rniga), lekin "Qolganini to'lash" tugmasi ko'rinmayapti.

## Test Qadamlari

### 1. Browser Console'ni Oching
- F12 bosing
- Console tab'ini tanlang

### 2. Shartnomani Oching
- Dashboard'ga kiring
- Shartnomani oching (3-oy uchun 13$ to'langan shartnoma)

### 3. Console'da Quyidagi Ma'lumotlarni Toping

```
🔍 Checking payment 3: {
  status: "UNDERPAID" yoki "PAID",
  remainingAmount: 117 yoki null,
  actualAmount: 13,
  expectedAmount: 130,
  amount: 130
}
```

### 4. Natijani Tekshiring

```
📊 Final result for payment 3: {
  hasShortage: true yoki false,
  remainingAmountToShow: 117 yoki 0,
  willShowButton: true yoki false
}
```

## Kutilayotgan Natija

- `hasShortage` = `true`
- `remainingAmountToShow` = `117`
- `willShowButton` = `true`

## Agar Natija Noto'g'ri Bo'lsa

### A. `remainingAmount` = `null` bo'lsa
Backend'da to'lov yaratilganda `remainingAmount` saqlanmagan.

**Yechim**: Backend'da to'lovni qayta yarating yoki mavjud to'lovni yangilang.

### B. `status` = `"PAID"` bo'lsa (UNDERPAID emas)
Backend'da to'lov holati noto'g'ri saqlanган.

**Yechim**: Backend'da `paymentStatus` mantiqini tekshiring.

### C. `actualAmount` = `null` bo'lsa
Backend'da `actualAmount` saqlanmagan.

**Yechim**: Backend'da to'lovni qayta yarating.

## Debug Komandalar

```javascript
// Console'da ishlatish uchun
// 1. Barcha to'lovlarni ko'rish
console.table(payments);

// 2. 3-oy to'lovini topish
const payment3 = payments.find(p => p.paymentType === 'monthly' && p.isPaid);
console.log('Payment 3:', payment3);

// 3. remainingAmount tekshirish
console.log('Remaining Amount:', payment3?.remainingAmount);
console.log('Status:', payment3?.status);
```

## Keyingi Qadamlar

1. Console'dagi ma'lumotlarni screenshot qiling
2. Menga yuboring
3. Muammoni hal qilamiz
