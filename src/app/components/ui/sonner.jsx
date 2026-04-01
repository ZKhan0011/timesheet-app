import { Toaster as Sonner } from "sonner";

export function Toaster(props) {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: '#1f2937',
          border: '1px solid #84cc16',
          color: '#fff',
        },
      }}
      {...props}
    />
  );
}
