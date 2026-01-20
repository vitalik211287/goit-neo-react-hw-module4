import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div style={overlay}>
      <ClipLoader color="#3563e4" size={56} />
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(255,255,255,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};
