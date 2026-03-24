import type { ReactNode } from "react";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { List, X } from "react-bootstrap-icons";
import Sidebar from "./Sidebar";
import TransactionHistory from "./TransactionHistory";

interface MainLayoutProps {
  children: ReactNode;
  onTransactionAdded?: () => void;
  openTransactionModal?: () => void;
  hideAddButton?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onTransactionAdded, openTransactionModal, hideAddButton = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleHistory = () => setHistoryOpen(!historyOpen);
  const closeHistory = () => setHistoryOpen(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f7f6" }} className="app-layout-responsive">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div 
        className={`sidebar-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}
        style={{ 
          position: "fixed",
          top: 0,
          left: 0,
          width: "280px",
          height: "100vh",
          backgroundColor: "#007bff",
          zIndex: 1000,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
          boxShadow: sidebarOpen ? "2px 0 8px rgba(0,0,0,0.1)" : "none"
        }}
      >
        <button 
          className="sidebar-close-btn d-lg-none" 
          onClick={closeSidebar}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "white",
            zIndex: 1001,
            transition: "transform 0.3s ease",
            padding: "8px"
          }}
          aria-label="Close sidebar"
        >
          <X size={28} />
        </button>
        <Sidebar onItemClick={closeSidebar} />
      </div>

      {/* Sidebar overlay for mobile */}
      <div 
        className="sidebar-overlay d-lg-none"
        onClick={closeSidebar}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
          opacity: sidebarOpen ? 1 : 0,
          visibility: sidebarOpen ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          pointerEvents: sidebarOpen ? "auto" : "none"
        }}
      />

      {/* Main content area */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", width: "100%" }}>
        {/* Header with hamburger button - visible only on mobile/tablet */}
        <div className="d-lg-none" style={{
          backgroundColor: "#007bff",
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px"
        }}>
          <button 
            className="header-hamburger-btn"
            onClick={toggleSidebar}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontSize: "24px",
              padding: "0",
              display: "flex",
              alignItems: "center"
            }}
            aria-label="Toggle navigation menu"
          >
            <List size={28} />
          </button>
          <h5 style={{ margin: 0, color: "white", fontSize: "18px", fontWeight: "bold" }}>
            SipDana
          </h5>
          <button 
            className="history-toggle-btn"
            onClick={toggleHistory}
            style={{
              background: "#0056b3",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontSize: "16px",
              padding: "8px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center"
            }}
            aria-label="Toggle transaction history"
          >
            📋
          </button>
        </div>

        {/* Main content */}
        <div style={{ flexGrow: 1, display: "flex", width: "100%", minHeight: 0 }}>
          <div className="main-content-wrapper" style={{ flexGrow: 1, padding: "20px", overflowY: "auto", minWidth: 0 }}>
            {children}
          </div>

          {/* History Panel - Hidden on mobile, visible on desktop */}
          <div className="history-panel-wrapper d-none d-lg-block" style={{ width: "350px", minWidth: "350px", borderLeft: "1px solid #e0e0e0", backgroundColor: "#eef7ff" }}>
            <TransactionHistory onTransactionAdded={onTransactionAdded!} openTransactionModal={openTransactionModal!} hideAddButton={hideAddButton} />
          </div>
        </div>
      </div>

      {/* History Drawer for mobile - Slides in from bottom */}
      {historyOpen && (
        <div 
          className="history-drawer-overlay d-lg-none"
          onClick={closeHistory}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1002,
            animation: "fadeIn 0.3s ease"
          }}
        />
      )}
      <div 
        className={`history-drawer d-lg-none ${historyOpen ? "history-drawer-open" : ""}`}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: historyOpen ? "85vh" : "0",
          zIndex: 1003,
          backgroundColor: "#eef7ff",
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: historyOpen ? "0 -4px 12px rgba(0,0,0,0.1)" : "none"
        }}
      >
        <div style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#007bff"
        }}>
          <h6 style={{ margin: 0, color: "white", fontWeight: "bold" }}>
            Riwayat Transaksi
          </h6>
          <button 
            onClick={closeHistory}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontSize: "24px",
              padding: "0"
            }}
            aria-label="Close history drawer"
          >
            <X size={24} />
          </button>
        </div>
        <div style={{ overflowY: "auto", maxHeight: "calc(85vh - 50px)" }}>
          <TransactionHistory onTransactionAdded={onTransactionAdded!} openTransactionModal={openTransactionModal!} hideAddButton={hideAddButton} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
