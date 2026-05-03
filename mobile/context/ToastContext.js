import { createContext, useContext, useState } from "react";
import { View, Text } from "react-native";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 1800);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <View style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 45,
          backgroundColor: "white",
          borderRadius: 18,
          paddingVertical: 15,
          paddingHorizontal: 18,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: toast.type === "error" ? "#fecaca" : "#dbeafe"
        }}>
          <View style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: toast.type === "error" ? "#fee2e2" : "#eff6ff",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12
          }}>
            <Text>
              {toast.type === "error" ? "!" : "✓"}
            </Text>
          </View>

          <Text style={{
            flex: 1,
            color: "#111827",
            fontSize: 15,
            fontWeight: "800"
          }}>
            {toast.message}
          </Text>
        </View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}