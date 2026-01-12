import { useEffect, useRef, useState } from "react";
// import "../../css/ConfirmDialog.css";
// import '../../css/confirmNewPlanePage.css'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from "@mui/material";


const ConfirmDialog = ({ isOpen, onClose, onConfirm, isPending }) => {
  const dialogRef = useRef(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);



  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Are you sure?</DialogTitle>

      <DialogContent>
        <Typography variant="body1">
          Changing the plan will result in{" "}
          <strong>keeping any unused benefits</strong>. Do you want to proceed?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Yes"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "No"}
        </Button>
      </DialogActions>
    </Dialog>
  )
  // return (
  //   <div className="dialog-backdrop">
  //     <div className="dialog-box" ref={dialogRef}>
  //       <h2 className="dialog-title">Are you sure?</h2>
  //       <p className="dialog-message">
  //         Changing  plan will result in <strong>keep any unused benefits</strong>.
  //         Do you want to proceed?
  //       </p>

  //       <div className="dialog-actions">
  //         <button className="main-button" onClick={onConfirm} disabled={isPending}> {isPending ? "Loading..." : "yes"}</button>
  //         <button className="secondary-button" onClick={() => {
  //           onClose()
  //         }} disabled={isPending}> {isPending ? "Loading..." : "no"}</button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default ConfirmDialog;