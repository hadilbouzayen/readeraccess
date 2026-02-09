interface IListConfig {
  name: string;
  columns: string[];
  lookupFieldProperties?: Record<string, string[]>; // Optional property for lookup fields
}

const LIST_CONFIG: Record<string, IListConfig> = {
  INITIATIVE_TYPE: {
    name: "InitiativeType",
    columns: ["Id", "Title"],
  },
  PROJECT_TYPE: {
    name: "ProjectType",
    columns: ["Id", "Title"],
  },
  POLICY_TYPE: {
    name: "PolicyType",
    columns: ["Id", "Title"],
  },
  COUNTRIES: {
    name: "Countries",
    // columns: ["Id", "Title", "Category", "PoliticalProcess"]
    columns: ["Id", "Title", "Category"],
  },
  INSTITUTION: {
    name: "Institution",
    columns: ["Id", "InstitutionType", "InstitutionName", "OtherType"],
  },
  JVAP_DOMAINS: {
    name: "Domains",
    columns: ["Id", "Abv", "DomainName"],
  },
  JVAP_PRIORITIES: {
    name: "Priorities",
    columns: ["Id", "PriorityName", "Domain"],
    lookupFieldProperties: {
      Domain: ["Id", "Abv", "DomainName"],
    },
  },
  FUNDING_PARTNER: {
    name: "FundingPartner",
    columns: ["Id", "FundingCategory", "FundingName", "OtherType"],
  },
};

export default LIST_CONFIG;
