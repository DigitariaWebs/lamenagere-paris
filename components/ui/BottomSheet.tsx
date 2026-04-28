import React from "react";
import Modal from "./Modal";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet(props: BottomSheetProps) {
  return <Modal {...props} />;
}
