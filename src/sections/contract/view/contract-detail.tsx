import type { RootState } from "src/store";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Unstable_Grid2";
import { Box, Paper, Button } from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { DashboardContent } from "src/layouts/dashboard";
import { setContractId } from "src/store/slices/contractSlice";
import { getContract } from "src/store/actions/contractActions";

import { Iconify } from "src/components/iconify";
import Loader from "src/components/loader/Loader";
import CustomerInfo from "src/components/customer-infos/customerInfo";
import { PaymentSchedule } from "src/components/payment-schedule";
import PayCommentModal from "src/components/render-payment-history/pay-comment-modal";
import { EditHistory } from "src/components/edit-history";

import Calculate from "./calculate";

const ContractDetails = () => {
  const dispatch = useAppDispatch();
  const [selectedComment, setSelectedComment] = useState("");
  const { contract, isLoading, contractId } = useSelector(
    (state: RootState) => state.contract
  );
  const { customer } = useSelector((state: RootState) => state.customer);

  // Shartnoma ochilganda ma'lumotlarni qayta yuklash
  useEffect(() => {
    if (contractId) {
      console.log("Loading contract:", contractId);
      dispatch(getContract(contractId));
    }
  }, [contractId, dispatch]);

  // Customer ma'lumotlarini contract.customer dan olish
  const contractCustomer = contract?.customer || customer;

  // Debug: contract ma'lumotlarini ko'rish
  useEffect(() => {
    if (contract) {
      console.log("Contract data:", {
        id: contract._id,
        totalPaid: contract.totalPaid,
        initialPayment: contract.initialPayment,
        totalPrice: contract.totalPrice,
        remainingDebt: contract.remainingDebt,
        paymentsCount: contract.payments?.length,
      });
    }
  }, [contract]);

  if (!contract && isLoading) {
    return <Loader />;
  }
  return (
    <DashboardContent>
      <Box
        display="flex"
        alignItems="center"
        mb={5}
        justifyContent="space-between"
      >
        <Button
          color="inherit"
          startIcon={<Iconify icon="weui:back-filled" />}
          onClick={() => dispatch(setContractId(null))}
        >
          Ortga
        </Button>
      </Box>

      <Grid container spacing={3} my={2}>
        {/* Mijoz ma'lumotlari */}
        <Grid xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {contract?.customer && (
              <CustomerInfo customer={contractCustomer} top />
            )}
          </Paper>
        </Grid>

        {/* Shartnoma ma'lumotlari */}
        <Grid xs={12}>{contract && <Calculate contract={contract} />}</Grid>

        {/* To'lov jadvali */}
        <Grid xs={12}>
          {contract && (
            <PaymentSchedule
              startDate={contract.startDate}
              monthlyPayment={contract.monthlyPayment}
              period={contract.period}
              initialPayment={contract.initialPayment}
              initialPaymentDueDate={contract.initialPaymentDueDate}
              contractId={contract._id}
              remainingDebt={contract.remainingDebt}
              totalPaid={contract.totalPaid}
              payments={contract.payments}
              onPaymentSuccess={() => {
                dispatch(getContract(contract._id));
              }}
            />
          )}
        </Grid>

        {/* Tahrirlash tarixi */}
        {contract?.editHistory && contract.editHistory.length > 0 && (
          <Grid xs={12}>
            <EditHistory editHistory={contract.editHistory} />
          </Grid>
        )}
      </Grid>
      <PayCommentModal
        open={selectedComment}
        onClose={() => setSelectedComment("")}
      />
    </DashboardContent>
  );
};

export default ContractDetails;
