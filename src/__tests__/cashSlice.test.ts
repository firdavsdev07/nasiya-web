/**
 * Cash Slice Tests
 * Requirements: 10.1, 10.2
 *
 * MINIMAL TEST - Core functionality only
 * These tests validate the Redux slice reducers
 */

import cashReducer, {
  setPayments,
  setError,
  start,
  success,
  failure,
  CashState,
} from "../store/slices/cashSlice";
import type { IPayment } from "../types/cash";
import { PaymentType, PaymentStatus } from "../types/cash";

// Mock payment data
const mockPayment: IPayment = {
  _id: "507f1f77bcf86cd799439011",
  amount: 1000,
  date: new Date("2024-01-15"),
  isPaid: false,
  paymentType: PaymentType.MONTHLY,
  notes: "Test payment",
  customerId: {
    _id: "507f1f77bcf86cd799439012",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+998901234567",
  },
  managerId: {
    _id: "507f1f77bcf86cd799439013",
    firstName: "Jane",
    lastName: "Smith",
  },
  status: PaymentStatus.PENDING,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
};

/**
 * Test 1: Initial state should be correct
 */
function testInitialState() {
  console.log("\n🧪 TEST 1: Initial state");

  try {
    const state = cashReducer(undefined, { type: "@@INIT" });

    if (!Array.isArray(state.payments)) {
      throw new Error("payments should be an array");
    }

    if (state.payments.length !== 0) {
      throw new Error("payments should be empty initially");
    }

    if (state.isLoading !== false) {
      throw new Error("isLoading should be false initially");
    }

    if (state.error !== null) {
      throw new Error("error should be null initially");
    }

    console.log("✅ PASS: Initial state is correct");
    return true;
  } catch (error) {
    console.error("❌ FAIL:", (error as Error).message);
    return false;
  }
}

/**
 * Test 2: setPayments should update payments array
 */
function testSetPayments() {
  console.log("\n🧪 TEST 2: setPayments reducer");

  try {
    const initialState: CashState = {
      payments: [],
      isLoading: true,
      error: "Some error",
    };

    const state = cashReducer(initialState, setPayments([mockPayment]));

    if (state.payments.length !== 1) {
      throw new Error("payments should have 1 item");
    }

    if (state.payments[0]._id !== mockPayment._id) {
      throw new Error("payment ID should match");
    }

    if (state.isLoading !== false) {
      throw new Error("isLoading should be false after setPayments");
    }

    if (state.error !== null) {
      throw new Error("error should be null after setPayments");
    }

    console.log("✅ PASS: setPayments works correctly");
    return true;
  } catch (error) {
    console.error("❌ FAIL:", (error as Error).message);
    return false;
  }
}

/**
 * Test 3: setError should update error state
 */
function testSetError() {
  console.log("\n🧪 TEST 3: setError reducer");

  try {
    const initialState: CashState = {
      payments: [mockPayment],
      isLoading: true,
      error: null,
    };

    const errorMessage = "Test error message";
    const state = cashReducer(initialState, setError(errorMessage));

    if (state.error !== errorMessage) {
      throw new Error("error should be set");
    }

    if (state.isLoading !== false) {
      throw new Error("isLoading should be false after setError");
    }

    console.log("✅ PASS: setError works correctly");
    return true;
  } catch (error) {
    console.error("❌ FAIL:", (error as Error).message);
    return false;
  }
}

/**
 * Test 4: start should set loading state
 */
function testStart() {
  console.log("\n🧪 TEST 4: start reducer");

  try {
    const initialState: CashState = {
      payments: [],
      isLoading: false,
      error: "Previous error",
    };

    const state = cashReducer(initialState, start());

    if (state.isLoading !== true) {
      throw new Error("isLoading should be true after start");
    }

    if (state.error !== null) {
      throw new Error("error should be cleared after start");
    }

    console.log("✅ PASS: start works correctly");
    return true;
  } catch (error) {
    console.error("❌ FAIL:", (error as Error).message);
    return false;
  }
}

/**
 * Test 5: success should clear loading state
 */
function testSuccess() {
  console.log("\n🧪 TEST 5: success reducer");

  try {
    const initialState: CashState = {
      payments: [],
      isLoading: true,
      error: "Previous error",
    };

    const state = cashReducer(initialState, success());

    if (state.isLoading !== false) {
      throw new Error("isLoading should be false after success");
    }

    if (state.error !== null) {
      throw new Error("error should be cleared after success");
    }

    console.log("✅ PASS: success works correctly");
    return true;
  } catch (error) {
    console.error("❌ FAIL:", (error as Error).message);
    return false;
  }
}

/**
 * Run all tests
 */
export function runTests() {
  console.log("🚀 Starting Cash Slice Tests...");
  console.log("=".repeat(50));

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  // Test 1
  results.total++;
  if (testInitialState()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 2
  results.total++;
  if (testSetPayments()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 3
  results.total++;
  if (testSetError()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 4
  results.total++;
  if (testStart()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 5
  results.total++;
  if (testSuccess()) {
    results.passed++;
  } else {
    results.failed++;
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST RESULTS:");
  console.log(`   Total: ${results.total}`);
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log("=".repeat(50));

  return results.failed === 0;
}

// Run tests if executed directly
if (typeof window === "undefined") {
  runTests();
}
