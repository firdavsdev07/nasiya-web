# Contract Edit UI Components

Bu faylda shartnoma tahrirlash uchun yaratilgan yangi UI komponentlar haqida ma'lumot berilgan.

## Komponentlar

### 1. ImpactSummary Component

**Manzil:** `web/src/components/impact-summary/ImpactSummary.tsx`

Shartnoma tahrirlashning to'lovlarga ta'sirini ko'rsatadi.

**Props:**

- `impact: ImpactSummaryData | null` - Ta'sir tahlili ma'lumotlari

**Xususiyatlar:**

- UNDERPAID holatini qizil alert bilan ko'rsatadi
- OVERPAID holatini yashil alert bilan ko'rsatadi
- Jami yetishmayapti/ortiqcha summalarni ko'rsatadi
- Qo'shimcha to'lovlar sonini ko'rsatadi

**Foydalanish:**

```tsx
import { ImpactSummary } from "src/components/impact-summary";

<ImpactSummary impact={impactSummary} />;
```

---

### 2. ModalContractEdit Component

**Manzil:** `web/src/sections/contract/modal/modal-contract-edit.tsx`

Shartnomani tahrirlash uchun modal dialog.

**Xususiyatlar:**

- Oylik to'lov, boshlang'ich to'lov va umumiy narxni tahrirlash
- Real-time impact tahlili (500ms debounce)
- Validatsiya xatolari ko'rsatish
- Ikki bosqichli tasdiqlash (davom etish → tasdiqlash)
- O'zgarishlar summarysi
- Loading states

**API Endpoints:**

- `POST /contract/analyze-impact/:id` - Ta'sir tahlili
- `PUT /contract` - Shartnomani yangilash

---

### 3. PaymentHistory Component (Yangilangan)

**Manzil:** `web/src/components/payment-history/PaymentHistory.tsx`

To'lovlar tarixini yangi status badge'lar bilan ko'rsatadi.

**Yangi Xususiyatlar:**

- Status badge'lar: PAID, UNDERPAID, OVERPAID, PENDING, REJECTED
- Payment type ko'rsatish: initial, monthly, extra
- Remaining amount (kam to'langan holat uchun)
- Excess amount (ko'p to'langan holat uchun)
- Prepaid amount indicator
- Linked payment link

**Foydalanish:**

```tsx
import PaymentHistory from "src/components/payment-history/PaymentHistory";

<PaymentHistory
  contractId={contractId}
  customerId={customerId}
  title="To'lovlar Tarixi"
/>;
```

---

### 4. EditHistoryTimeline Component

**Manzil:** `web/src/components/edit-history-timeline/EditHistoryTimeline.tsx`

Shartnoma tahrirlash tarixini timeline formatida ko'rsatadi.

**Xususiyatlar:**

- Timeline formatida ko'rsatish
- Har bir tahrirlash uchun:
  - Sana va tahrirlagan shaxs
  - O'zgarishlar ro'yxati
  - Ta'sir tahlili (impact summary)
  - Ta'sirlangan to'lovlar ro'yxati
- Material-UI Lab Timeline komponenti

**Dependencies:**

- `@mui/lab` - Timeline komponentlari uchun (allaqachon o'rnatilgan)

**Foydalanish:**

```tsx
import { EditHistoryTimeline } from "src/components/edit-history-timeline";

<EditHistoryTimeline editHistory={contract.editHistory} />;
```

---

### 5. ContractEditAlert Component

**Manzil:** `web/src/components/contract-edit-alert/ContractEditAlert.tsx`

Shartnoma tahrirlash haqida alert notification.

**Xususiyatlar:**

- Shartnoma va mijoz ma'lumotlari
- Impact summary chip'lar
- Expandable o'zgarishlar ro'yxati
- Quick actions: shartnomani ko'rish, to'lovlarni ko'rish
- Dismiss funksiyasi

**Foydalanish:**

```tsx
import { ContractEditAlert } from "src/components/contract-edit-alert";

<ContractEditAlert
  notification={notification}
  onViewContract={(id) => navigate(`/contract/${id}`)}
  onViewPayments={(id) => navigate(`/contract/${id}#payments`)}
  onDismiss={(id) => handleDismiss(id)}
/>;
```

---

### 6. DashboardAlerts Component

**Manzil:** `web/src/components/dashboard-alerts/DashboardAlerts.tsx`

Dashboard uchun bir nechta alert'larni ko'rsatuvchi container.

**Props:**

- `notifications: ContractEditNotification[]` - Notification'lar ro'yxati
- `maxDisplay?: number` - Maksimal ko'rsatiladigan notification'lar soni (default: 5)

**Xususiyatlar:**

- Bir nechta ContractEditAlert'larni ko'rsatadi
- Navigation integratsiyasi
- Dismiss funksiyasi

**Foydalanish:**

```tsx
import { DashboardAlerts } from "src/components/dashboard-alerts";

<DashboardAlerts notifications={notifications} maxDisplay={5} />;
```

---

## Type Definitions

### ImpactSummaryData

```typescript
interface ImpactSummaryData {
  underpaidCount: number;
  overpaidCount: number;
  totalShortage: number;
  totalExcess: number;
  additionalPaymentsCreated: number;
}
```

### ContractEditNotification

```typescript
interface ContractEditNotification {
  _id: string;
  contractId: string;
  contractNumber: string;
  customerName: string;
  editedBy: string;
  editDate: string;
  changes: Array<{
    field: string;
    oldValue: number;
    newValue: number;
  }>;
  impactSummary: ImpactSummaryData;
}
```

---

## Integratsiya

### Contract Detail View

`web/src/sections/contract/view/contract-detail.tsx` faylida EditHistoryTimeline qo'shilgan:

```tsx
{
  contract?.editHistory && contract.editHistory.length > 0 && (
    <Grid xs={12}>
      <EditHistoryTimeline editHistory={contract.editHistory} />
    </Grid>
  );
}
```

### Contract View Index

`web/src/sections/contract/view/index.tsx` faylida ModalContractEdit qo'shilgan:

```tsx
<ModalContractEdit />
```

---

## Backend API Requirements

Ushbu komponentlar quyidagi backend endpoint'larni talab qiladi:

1. **POST /contract/analyze-impact/:id**

   - Request body: `{ monthlyPayment, initialPayment, totalPrice }`
   - Response: `{ impactSummary: ImpactSummaryData }`

2. **PUT /contract**

   - Request body: Contract update data
   - Response: `{ message, changes, impactSummary, affectedPayments }`

3. **GET /contract/get-contract-by-id/:id**
   - Response: Contract data with `editHistory` and `prepaidBalance` fields

---

## Styling

Barcha komponentlar Material-UI theme bilan integratsiya qilingan va responsive design'ga ega.

### Color Scheme

- UNDERPAID: `error` (qizil)
- OVERPAID: `success` (yashil)
- PENDING: `warning` (sariq)
- PAID: `success` (yashil)
- REJECTED: `error` (qizil)

---

## Testing

Komponentlarni test qilish uchun:

1. Shartnomani tahrirlash modal'ini ochish
2. Oylik to'lovni o'zgartirish va impact tahlilini ko'rish
3. Tasdiqlash va saqlash
4. Edit history timeline'da yangi tahrirlashni ko'rish
5. Payment history'da yangi status badge'larni ko'rish

---

## Future Improvements

- [ ] Real-time notification system (WebSocket)
- [ ] Export edit history to PDF
- [ ] Filter and search in edit history
- [ ] Undo/Redo functionality
- [ ] Bulk contract edits
- [ ] Email notifications for contract edits
