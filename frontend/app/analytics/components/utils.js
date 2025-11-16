export const getStatusBadge = (status) => {
  const statusConfig = {
    cleared: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Cleared",
    },
    rejected: { bg: "bg-rose-100", text: "text-rose-700", label: "Rejected" },
    scheduled: { bg: "bg-sky-100", text: "text-sky-700", label: "Scheduled" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
    offer_received: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Offer Received",
    },
    offer_accepted: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      label: "Offer Accepted",
    },
  };

  return statusConfig[status] || {
    bg: "bg-slate-100",
    text: "text-slate-700",
    label: status,
  };
};

export const getEventTypeLabel = (type) => {
  const labels = {
    pre_placement_talk: "Pre-Placement Talk",
    company_presentation: "Company Presentation",
    resume_screening: "Resume Screening",
    online_assessment: "Online Assessment",
    aptitude_test: "Aptitude Test",
    coding_test: "Coding Test",
    technical_mcq: "Technical MCQ",
    technical_round_1: "Technical Round 1",
    technical_round_2: "Technical Round 2",
    technical_round_3: "Technical Round 3",
    group_discussion: "Group Discussion",
    case_study: "Case Study",
    presentation_round: "Presentation Round",
    hr_round: "HR Round",
    final_round: "Final Round",
  };
  return labels[type] || type;
};

export const getCompanyTypeColor = (category) => {
  switch (category) {
    case "Product":
      return "bg-purple-100 text-purple-800";
    case "Service":
      return "bg-sky-100 text-sky-800";
    case "Mass Recruiter":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};
