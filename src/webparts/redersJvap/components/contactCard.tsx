/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Autorenew as RefreshCw,
  Close as X,
  CheckCircle as CheckCheck,
  Send,
  Language as LanguageIcon,
  ArrowBack
} from "@mui/icons-material";

interface ContactCardProps {
  isFP: boolean;
  isC: boolean;
  userInfo: any;
  pendingCount: number;
  rejectedCount: number;
  approvedCount: number;
  setTriggerNotif: (val: boolean) => void;
  datalenth: number;
  language: string;
  onLanguageChange: (lang: string) => void;
  translations: any;
  isAdmin: boolean;
}

const StatusCard = ({
  icon: Icon,
  label,
  count,
  variant,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  variant: "pending" | "rejected" | "approved";
}) => {
  const styles = {
    pending: {
      bgcolor: "rgb(255, 248, 225)", // yellow-50 equivalent
      borderColor: "#ffc107",
      color: "#bfa004",
      iconBg: "rgba(255, 193, 7, 0.2)",
      iconColor: "#ffc107"
    },
    rejected: {
      bgcolor: "rgb(255, 235, 238)", // red-50
      borderColor: "#ef5350",
      color: "#c62828",
      iconBg: "rgba(239, 83, 80, 0.2)",
      iconColor: "#ef5350"
    },
    approved: {
      bgcolor: "rgb(232, 245, 233)", // green-50
      borderColor: "#66bb6a",
      color: "#2e7d32",
      iconBg: "rgba(102, 187, 106, 0.2)",
      iconColor: "#66bb6a"
    },
  };

  const currentStyle = styles[variant];

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
        borderRadius: 2,
        bgcolor: currentStyle.bgcolor,
        borderLeft: `4px solid ${currentStyle.borderColor}`,
        width: "80%"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            borderRadius: "50%",
            bgcolor: currentStyle.iconBg,
            color: currentStyle.iconColor
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: currentStyle.color }}>
        {count}
      </Typography>
    </Paper>
  );
};

const ContactCard: React.FC<ContactCardProps> = ({
  isFP,
  isC,
  userInfo,
  pendingCount,
  rejectedCount,
  approvedCount,
  setTriggerNotif,
  datalenth,
  language,
  onLanguageChange,
  translations,
  isAdmin
}) => {
  let userName, userEmail, partner, organisation;

  if (isAdmin) {
    userName = userInfo?.Title || "Administrator";
    userEmail = userInfo?.Email;
    partner = "All Partners";
    organisation = "ICMPD";
  } else if (isFP) {
    userName = userInfo?.focalPointResult?.Title;
    userEmail = userInfo?.focalPointResult?.Email;
    partner = userInfo?.focalPointResult?.Country;
    organisation = userInfo?.focalPointResult?.Organisation;
  } else {
    userName = userInfo?.contrebutorResult?.Title;
    userEmail = userInfo?.contrebutorResult?.Email;
    partner = userInfo?.contrebutorResult?.FocalPointRef?.Country;
    organisation = userInfo?.contrebutorResult?.Organisation;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        overflow: "hidden",
        borderRadius: 4,
        marginBottom: 3,
        border: "1px solid rgba(0,0,0,0.06)",
        bgcolor: "#ffffff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          bgcolor: "transparent",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              component="a"
              href={isAdmin ? "https://jvap.sharepoint.com/sites/ICMPD/SitePages/Admin.aspx" : "https://jvap.sharepoint.com/sites/ICMPD/SitePages/Initiatives.aspx"}
              sx={{ p: 1, mr: 1, bgcolor: "rgba(0,0,0,0.04)", "&:hover": { bgcolor: "rgba(0,0,0,0.08)" } }}
            >
              <ArrowBack sx={{ fontSize: 20, color: "text.primary" }} />
            </IconButton>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "primary.main",
                opacity: 0.9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#ffffff"
              }}
            >
              {userName?.charAt(0) || "U"}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, color: "text.primary" }}>
                {userName || "--"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {userEmail || "--"}
              </Typography>
              <Chip
                label={isAdmin ? "Administrator" : (isFP ? "Focal Point" : "Contributor")}
                size="small"
                sx={{
                  mt: 0.5,
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  bgcolor: "rgba(33, 150, 243, 0.1)", // Light blue
                  color: "#1976d2" // Primary blue
                }}
              />
            </Box>
          </Box>

          {/* Language Toggle */}
          <Box
            sx={{
              display: "flex",
              overflow: "hidden",
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.12)",
            }}
          >
            {["en", "fr"].map((lang) => (
              <Box
                key={lang}
                onClick={() => onLanguageChange(lang)}
                sx={{
                  cursor: "pointer",
                  px: 1,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  bgcolor: language === lang ? "rgba(0,0,0,0.05)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.02)"
                  }
                }}
              >
                <img
                  src={lang === "en" ? require("../assets/eng.png") : require("../assets/fr.png")}
                  alt={lang === "en" ? "English" : "French"}
                  style={{ width: "22px", height: "16px", objectFit: "cover", borderRadius: "2px", marginRight: "6px" }}
                />
                <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1 }}>
                  {lang.toUpperCase()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>


      </Box>

      {/* Body */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
            gap: 3,
            alignItems: "start"
          }}
        >
          {/* Left: Details */}
          <Box sx={{ borderRight: { md: "1px solid rgba(0,0,0,0.12)" }, pr: { md: 2 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.primary", letterSpacing: "0.05em", opacity: 0.7 }}>
                  {translations?.card?.Partner || "Partner"}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5, color: "text.primary" }}>
                  {partner || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.primary", letterSpacing: "0.05em", opacity: 0.7 }}>
                  {translations?.card?.Organisation || "Organisation"}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5, color: "text.primary" }}>
                  {organisation || "—"}
                </Typography>
              </Box>
            </Box>
            {isFP && (
              <Typography variant="body2" sx={{ mt: 4, color: "text.secondary", maxWidth: "800px", lineHeight: 1.6 }}>
                {translations?.card?.Purpose || "This page is for the management of persons who have requested access to the JVAP Data Browser or Dashboard. Granting approval does not give them access to the data collection site or any unpublished data. You may remove access at any time."}
              </Typography>
            )}
          </Box>

          {/* Right: Status Cards */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <StatusCard
              icon={RefreshCw}
              label={translations?.card?.PendingReaders || "Pending"}
              count={pendingCount}
              variant="pending"
            />
            <StatusCard
              icon={X}
              label={translations?.card?.RejectedReaders || "Rejected"}
              count={rejectedCount}
              variant="rejected"
            />
            <StatusCard
              icon={CheckCheck}
              label={translations?.card?.ApprovedReaders || "Approved"}
              count={approvedCount}
              variant="approved"
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ContactCard;
