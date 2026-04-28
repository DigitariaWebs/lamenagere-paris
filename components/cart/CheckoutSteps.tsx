import React from "react";
import Stepper from "../ui/Stepper";

interface CheckoutStepsProps {
  currentStep: number;
}

const steps = [
  { label: "ÉTAPE 01", title: "Adresse" },
  { label: "ÉTAPE 02", title: "Livraison" },
  { label: "ÉTAPE 03", title: "Paiement" },
];

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const step = steps[currentStep - 1] || steps[0];
  return (
    <Stepper
      currentStep={currentStep}
      totalSteps={3}
      label={step.label}
      title={step.title}
    />
  );
}
